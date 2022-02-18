using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using OneSourceService.ADO;
using QnA.Hubs;
using QnA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace QnA.Controllers
{
    public class QnAController : Controller
    {
        // GET: QnA
        IHubContext context = GlobalHost.ConnectionManager.GetHubContext<ChatHub>();
        private static TimeZoneInfo INDIAN_ZONE = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
        public ActionResult Index()
        {
            if (Request.Cookies["Login"] != null)
            {
                ViewBag.User = Request.Cookies["Login"].Values["EmailID"];
            }
            else
                ViewBag.User = "null";
            return View();
        }
        public ActionResult Syllabus()
        {
            if (Request.Cookies["Login"] != null)
            {
                ViewBag.User = Request.Cookies["Login"].Values["EmailID"];
            }
            else
                ViewBag.User = "null";
            return View();
        }
        public ActionResult Notes()
        {
            if (Request.Cookies["Login"] != null)
            {
                ViewBag.User = Request.Cookies["Login"].Values["EmailID"];
            }
            else
                ViewBag.User = "null";
            return View();
        }
        public JsonResult SaveUser(string email, string pw)
        {
            try
            {
                List<UserModel> userlist = new List<UserModel>();
                string path = Server.MapPath("~/Content/Users.json");
                using (WebClient wc = new WebClient())
                {
                    userlist = JsonConvert.DeserializeObject<List<UserModel>>(wc.DownloadString(path));
                }
                userlist.Add(new UserModel() { Email = email, Password = pw });
                System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(userlist));
                SaveCookie(email, pw);
                return Json(true);
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                return Json(false);
            }
        }
        public void SaveCookie(string email, string pw)
        {
            HttpCookie cookie = new HttpCookie("Login");
            cookie.Values.Add("EmailID", email);
            cookie.Values.Add("Password", pw);
            cookie.Expires = DateTime.Now.AddDays(365);
            Response.Cookies.Add(cookie);
        }
        public ActionResult Logout()
        {
            if (Request.Cookies["Login"] != null)
            {
                HttpCookie cookie = new HttpCookie("Login");
                cookie.Expires = DateTime.Now.AddDays(-1);
                Response.Cookies.Add(cookie);
            }
            return Redirect("/QnA/Index");
        }

        public JsonResult GetUser(string email, string pw)
        {
            try
            {
                string path = Server.MapPath("~/Content/Users.json");
                List<UserModel> userlist = new List<UserModel>();
                using (WebClient wc = new WebClient())
                {
                    userlist = JsonConvert.DeserializeObject<List<UserModel>>(wc.DownloadString(path));
                }
                UserModel user = userlist.Where(x => x.Email == email && x.Password == pw).FirstOrDefault();
                if (user != null) { SaveCookie(email, pw); return Json(true); }
                else return Json(false);
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                return Json(false);
            }

        }


        public JsonResult SaveQuestion()
        {
            try
            {
                string topic= Request.Form["Topic"].ToString();
                string useremail = Request.Form["UserEmail"].ToString();
                List<QuestionModel> qns = new List<QuestionModel>();
                string path = Server.MapPath("~/Content/QnAs.json");
                using (WebClient wc = new WebClient())
                {
                    qns = JsonConvert.DeserializeObject<List<QuestionModel>>(wc.DownloadString(path));
                }
                int qid = qns.Count > 0 ? qns.Select(x => x.QuestionId).Max() : 0;
                //  Get all files from Request object  
                HttpFileCollectionBase files = Request.Files;
                if (files.Count > 0)
                {
                    string qno;
                    if (qns != null) qno = "/Content/ImageQns/Q" + (qid + 1) + ".png";
                    else qno = "/Content/ImageQns/Q1.png";
                    files[0].SaveAs(Server.MapPath("~/" + qno));
                    qns.Add(new QuestionModel() { IsImage = true, QuestionId = qid + 1,Topic= topic, UserEmail = useremail, Question = qno,PostCreated= TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, INDIAN_ZONE).ToString() });
                }
                else
                {
                    string fallbackStr = "";
                    Encoding enc = Encoding.GetEncoding(Encoding.ASCII.CodePage, new EncoderReplacementFallback(fallbackStr), new DecoderReplacementFallback(fallbackStr));
                    string qn = enc.GetString(enc.GetBytes(Request.Form["Question"].ToString()));
                    qns.Add(new QuestionModel() { IsImage = false, QuestionId = qid + 1, Topic = topic,UserEmail = useremail, Question = qn , PostCreated = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, INDIAN_ZONE).ToString() });
                }
                System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(qns));
                context.Clients.All.PostedQn(useremail);
                return Json(true);
            }
            catch (Exception)
            {
                return Json(false);
            }

        }
        public JsonResult UpdateSolution()
        {
            try
            {
                string useremail = Request.Form["UserEmail"].ToString();
                int qnid = Convert.ToInt16(Request.Form["Qid"]);
                string solstr = Request.Form["solstr"].ToString();

                string fallbackStr = "";
                Encoding enc = Encoding.GetEncoding(Encoding.ASCII.CodePage, new EncoderReplacementFallback(fallbackStr), new DecoderReplacementFallback(fallbackStr));

                solstr = enc.GetString(enc.GetBytes(solstr));

                List<QuestionModel> qns = new List<QuestionModel>();
                string path = Server.MapPath("~/Content/QnAs.json");
                using (WebClient wc = new WebClient())
                {
                    qns = JsonConvert.DeserializeObject<List<QuestionModel>>(wc.DownloadString(path));
                }
                QuestionModel qnm = qns.Where(x => x.QuestionId == qnid).FirstOrDefault();
                //  Get all files from Request object  
                HttpFileCollectionBase files = Request.Files;
                string impath = null;
                if (qnm.Solutions != null)
                {
                    string fname = "Q" + qnid + "_S" + (qnm.Solutions.Count + 1) + ".png";
                    if (files.Count > 0) { Request.Files[0].SaveAs(Server.MapPath("~/Content/ImageSolutions/" + fname)); impath = "/Content/ImageSolutions/" + fname; };
                    qnm.Solutions.Add(new Solution() { SolutionId = qnm.Solutions.Count + 1, Solutionstr = solstr, SolutionImage = impath, By = useremail,SolCreated = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, INDIAN_ZONE).ToString() });
                }
                else
                {
                    qnm.Solutions = new List<Solution>();
                    string fname = "Q" + qnid + "_S1.png";
                    if (files.Count > 0) { Request.Files[0].SaveAs(Server.MapPath("~/Content/ImageSolutions/" + fname)); impath = "/Content/ImageSolutions/" + fname; };
                    qnm.Solutions.Add(new Solution() { SolutionId = 1, Solutionstr = solstr, SolutionImage = "/Content/ImageSolutions/" + fname, By = useremail, SolCreated = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, INDIAN_ZONE).ToString() });
                }
                context.Clients.All.ReceiveComment(useremail, solstr, qnid, impath);
                System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(qns));
                return Json(true);
            }
            catch (Exception ex)
            {
                return Json("Error occurred. Error details: " + ex.Message);
            }

        }
        public JsonResult GetSolutions(string qn, string useremail)
        {
            try
            {
                List<QuestionModel> qns = new List<QuestionModel>();
                string path = Server.MapPath("~/Content/QnAs.json");
                using (WebClient wc = new WebClient())
                {
                    qns = JsonConvert.DeserializeObject<List<QuestionModel>>(wc.DownloadString(path));
                }
                return Json(qns);
            }
            catch (Exception)
            {
                return Json(false);
            }

        }
        public JsonResult DeleteQn(int qid)
        {
            try
            {
                List<QuestionModel> qns = new List<QuestionModel>();
                string path = Server.MapPath("~/Content/QnAs.json");
                using (WebClient wc = new WebClient())
                {
                    qns = JsonConvert.DeserializeObject<List<QuestionModel>>(wc.DownloadString(path));
                }
                QuestionModel qn = qns.Where(x => x.QuestionId == qid).First();
                if (qn.IsImage)
                {
                    System.IO.File.Delete(Server.MapPath("~" + qn.Question));
                }
                if (qn.Solutions.Count > 0)
                {
                    foreach (var item in qn.Solutions)
                    {
                        if (item.SolutionImage != null)
                        {
                            System.IO.File.Delete(Server.MapPath("~" + item.SolutionImage));
                        }
                    }
                }
                qns.Remove(qn);
                context.Clients.All.DeleteQn(qid);
                System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(qns));
                return Json(true);
            }
            catch (Exception)
            {
                return Json(false);
            }

        }

     
        public JsonResult GetNotes(string Topic)
        {
            if (Topic == null) Topic = "Physics";
            List<Notes> notes = null;
            string path = Server.MapPath("~/Content/Notes.json");
            using (WebClient wc = new WebClient())
            {
                notes = JsonConvert.DeserializeObject<List<Notes>>(wc.DownloadString(path));
            }
            notes = notes.Where(x => x.Topic == Topic).ToList();
            return Json(notes);
        }
        public JsonResult CreateNote(Notes note)
        {
            List<Notes> notes = null;
            string path = Server.MapPath("~/Content/Notes.json");
            using (WebClient wc = new WebClient())
            {
                notes = JsonConvert.DeserializeObject<List<Notes>>(wc.DownloadString(path));
            }
            note.NoteId = notes.Select(x => x.NoteId).Max()+1;
            note.CreatedDate = DateTime.Now;
            notes.Add(note);
            System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(notes));
            return Json(notes);
        }
        public JsonResult SaveNote(int id,string notedesc)
        {
            List<Notes> notes = null;
            string path = Server.MapPath("~/Content/Notes.json");
            using (WebClient wc = new WebClient())
            {
                notes = JsonConvert.DeserializeObject<List<Notes>>(wc.DownloadString(path));
            }
            Notes note = notes.Where(x => x.NoteId == id).FirstOrDefault();
            note.links.Add(notedesc);
            System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(notes));
            return Json(notes);
        }
        public JsonResult DeleteNotes(int id)
        {
            List<Notes> notes = null;
            string path = Server.MapPath("~/Content/Notes.json");
            using (WebClient wc = new WebClient())
            {
                notes = JsonConvert.DeserializeObject<List<Notes>>(wc.DownloadString(path));
            }
            notes.Remove(notes.Where(x => x.NoteId == id).FirstOrDefault());
            System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(notes));
            return Json(true);

        }
        public JsonResult Deletelink(int id,string notedesc)
        {
            List<Notes> notes = null;
            string path = Server.MapPath("~/Content/Notes.json");
            using (WebClient wc = new WebClient())
            {
                notes = JsonConvert.DeserializeObject<List<Notes>>(wc.DownloadString(path));
            }
            Notes note = notes.Where(x => x.NoteId == id).FirstOrDefault();
            note.links.Remove(notedesc);
            System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(notes));
            return Json(true);
        }

        public JsonResult DownloadHtml(string url)
        {
            string htmlCode;
            ServicePointManager.Expect100Continue = true;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls
                   | SecurityProtocolType.Tls11
                   | SecurityProtocolType.Tls12
                   | SecurityProtocolType.Ssl3;
            using (WebClient client = new WebClient()) // WebClient class inherits IDisposable
            {
                htmlCode = client.DownloadString(url);
            }

            return Json(htmlCode,JsonRequestBehavior.AllowGet);
        }
    }
}