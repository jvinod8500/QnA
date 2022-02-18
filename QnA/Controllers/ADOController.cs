//using QnA.Models;
//using System;
//using System.Collections.Generic;
//using System.Configuration;
//using System.Data.SqlClient;
//using System.Linq;
//using System.Web;
//using System.Web.Mvc;

//namespace QnA.Controllers
//{
//    public class ADOController : Controller
//    {

//        private string ConnectionString = string.Empty;

//        public ADOController()
//        {
//            ConnectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
//        }
//        public JsonResult SaveQuestion()
//        {
//            try
//            {
//                string useremail = Request.Form["UserEmail"].ToString();
//                List<QuestionModel> qns = new List<QuestionModel>();
//                string path = Server.MapPath("~/Content/QnAs.json");
//                using (WebClient wc = new WebClient())
//                {
//                    qns = JsonConvert.DeserializeObject<List<QuestionModel>>(wc.DownloadString(path));
//                }
//                int qid = qns.Count > 0 ? qns.Select(x => x.QuestionId).Max() : 0;
//                //  Get all files from Request object  
//                HttpFileCollectionBase files = Request.Files;
//                if (files.Count > 0)
//                {
//                    string qno;
//                    if (qns != null) qno = "/Content/ImageQns/Q" + (qid + 1) + ".png";
//                    else qno = "/Content/ImageQns/Q1.png";
//                    files[0].SaveAs(Server.MapPath("~/" + qno));
//                    qns.Add(new QuestionModel() { IsImage = true, QuestionId = qid + 1, UserEmail = useremail, Question = qno });
//                }
//                else
//                {
//                    string qn = Request.Form["Question"].ToString();
//                    qns.Add(new QuestionModel() { IsImage = false, QuestionId = qid + 1, UserEmail = useremail, Question = qn });
//                }
//                System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(qns));
//                context.Clients.All.PostedQn();
//                return Json(true);
//            }
//            catch (Exception)
//            {
//                return Json(false);
//            }

//        }
//        public JsonResult UpdateSolution()
//        {
//            try
//            {
//                string useremail = Request.Form["UserEmail"].ToString();
//                int qnid = Convert.ToInt16(Request.Form["Qid"]);
//                string solstr = Request.Form["solstr"].ToString();
//                List<QuestionModel> qns = new List<QuestionModel>();
//                string path = Server.MapPath("~/Content/QnAs.json");
//                using (WebClient wc = new WebClient())
//                {
//                    qns = JsonConvert.DeserializeObject<List<QuestionModel>>(wc.DownloadString(path));
//                }
//                QuestionModel qnm = qns.Where(x => x.QuestionId == qnid).FirstOrDefault();
//                //  Get all files from Request object  
//                HttpFileCollectionBase files = Request.Files;
//                string impath = null;
//                if (qnm.Solutions != null)
//                {
//                    string fname = "Q" + qnid + "_S" + (qnm.Solutions.Count + 1) + ".png";
//                    if (files.Count > 0) { Request.Files[0].SaveAs(Server.MapPath("~/Content/ImageSolutions/" + fname)); impath = "/Content/ImageSolutions/" + fname; };
//                    qnm.Solutions.Add(new Solution() { SolutionId = qnm.Solutions.Count + 1, Solutionstr = solstr, SolutionImage = impath, By = useremail });
//                }
//                else
//                {
//                    qnm.Solutions = new List<Solution>();
//                    string fname = "Q" + qnid + "_S1.png";
//                    if (files.Count > 0) { Request.Files[0].SaveAs(Server.MapPath("~/Content/ImageSolutions/" + fname)); impath = "/Content/ImageSolutions/" + fname; };
//                    qnm.Solutions.Add(new Solution() { SolutionId = 1, Solutionstr = solstr, SolutionImage = "/Content/ImageSolutions/" + fname, By = useremail });
//                }
//                context.Clients.All.ReceiveComment(useremail, solstr, qnid, impath);
//                System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(qns));
//                return Json(true);
//            }
//            catch (Exception ex)
//            {
//                return Json("Error occurred. Error details: " + ex.Message);
//            }

//        }
//        public JsonResult GetSolutions(string qn, string useremail)
//        {
//            try
//            {
//                List<QuestionModel> qns = new List<QuestionModel>();
//                string path = Server.MapPath("~/Content/QnAs.json");
//                using (WebClient wc = new WebClient())
//                {
//                    qns = JsonConvert.DeserializeObject<List<QuestionModel>>(wc.DownloadString(path));
//                }
//                return Json(qns);
//            }
//            catch (Exception)
//            {
//                return Json(false);
//            }

//        }
//        public JsonResult DeleteQn(int qid)
//        {
//            try
//            {
//                List<QuestionModel> qns = new List<QuestionModel>();
//                string path = Server.MapPath("~/Content/QnAs.json");
//                using (WebClient wc = new WebClient())
//                {
//                    qns = JsonConvert.DeserializeObject<List<QuestionModel>>(wc.DownloadString(path));
//                }
//                QuestionModel qn = qns.Where(x => x.QuestionId == qid).First();
//                if (qn.IsImage)
//                {
//                    System.IO.File.Delete(Server.MapPath("~" + qn.Question));
//                }
//                if (qn.Solutions.Count > 0)
//                {
//                    foreach (var item in qn.Solutions)
//                    {
//                        if (item.SolutionImage != null)
//                        {
//                            System.IO.File.Delete(Server.MapPath("~" + item.SolutionImage));
//                        }
//                    }
//                }
//                qns.Remove(qn);
//                System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(qns));
//                return Json(true);
//            }
//            catch (Exception)
//            {
//                return Json(false);
//            }

//        }
//        public int InsertArticle(QuestionModel qn)
//        {

//            //Create the SQL Query for inserting an article
//            string sqlQuery = String.Format("Insert into Article (Title, Body ,PublishDate, CategoryID) Values('{0}', '{1}', '{2}', {3} );"
//            + "Select @@Identity", article.Title, article.Body, article.PublishDate.ToString("yyyy-MM-dd"), article.CategoryId);

//            //Create and open a connection to SQL Server
//            SqlConnection connection = new SqlConnection(ConnectionString);
//            connection.Open();

//            //Create a Command object
//            SqlCommand command = new SqlCommand(sqlQuery, connection);

//            //Execute the command to SQL Server and return the newly created ID
//            int newArticleID = Convert.ToInt32((decimal)command.ExecuteScalar());

//            //Close and dispose
//            command.Dispose();
//            connection.Close();
//            connection.Dispose();

//            // Set return value
//            return newArticleID;
//        }

//        public int SaveArticle(QuestionModel article)
//        {

//            //Create the SQL Query for inserting an article
//            string createQuery = String.Format("Insert into Article (Title, Body ,PublishDate, CategoryID) Values('{0}', '{1}', '{2}', {3} );"
//                + "Select @@Identity", article.Title, article.Body, article.PublishDate.ToString("yyyy-MM-dd"), article.CategoryId);

//            //Create the SQL Query for updating an article
//            string updateQuery = String.Format("Update Article SET Title='{0}', Body = '{1}', PublishDate ='{2}', CategoryID = {3} Where ArticleID = {4};",
//                article.Title, article.Body, article.PublishDate.ToString("yyyy-MM-dd"), article.CategoryId, article.ArticleId);

//            //Create and open a connection to SQL Server
//            SqlConnection connection = new SqlConnection(ConnectionString);
//            connection.Open();

//            //Create a Command object
//            SqlCommand command = null;

//            if (article.ArticleId != 0)
//                command = new SqlCommand(updateQuery, connection);
//            else
//                command = new SqlCommand(createQuery, connection);

//            int savedArticleID = 0;
//            try
//            {
//                //Execute the command to SQL Server and return the newly created ID
//                var commandResult = command.ExecuteScalar();
//                if (commandResult != null)
//                {
//                    savedArticleID = Convert.ToInt32(commandResult);
//                }
//                else
//                {
//                    //the update SQL query will not return the primary key but if doesn't throw exception
//                    //then we will take it from the already provided data
//                    savedArticleID = article.ArticleId;
//                }
//            }
//            catch (Exception ex)
//            {
//                //there was a problem executing the script
//            }

//            //Close and dispose
//            command.Dispose();
//            connection.Close();
//            connection.Dispose();

//            return savedArticleID;
//        }



//        public Article GetArticleById(int articleId)
//        {
//            Article result = new Article();

//            //Create the SQL Query for returning an article category based on its primary key
//            string sqlQuery = String.Format("select * from Article where ArticleID={0}", articleId);

//            //Create and open a connection to SQL Server
//            SqlConnection connection = new SqlConnection(ConnectionString);
//            connection.Open();

//            SqlCommand command = new SqlCommand(sqlQuery, connection);

//            SqlDataReader dataReader = command.ExecuteReader();

//            //load into the result object the returned row from the database
//            if (dataReader.HasRows)
//            {
//                while (dataReader.Read())
//                {
//                    result.ArticleId = Convert.ToInt32(dataReader["ArticleID"]);
//                    result.Body = dataReader["Body"].ToString();
//                    result.CategoryId = Convert.ToInt32(dataReader["CategoryID"]);
//                    result.PublishDate = Convert.ToDateTime(dataReader["PublishDate"]);
//                    result.Title = dataReader["Title"].ToString();
//                }
//            }

//            return result;
//        }

//        public List<QuestionModel> GetArticles()
//        {

//            List<QuestionModel>  result = new List<QuestionModel>();
 
//            //Create the SQL Query for returning all the articles
//            string sqlQuery = String.Format("select * from Article");

//        //Create and open a connection to SQL Server
//        SqlConnection connection = new SqlConnection(ConnectionString);
//        connection.Open();
 
//            SqlCommand command = new SqlCommand(sqlQuery, connection);

//        //Create DataReader for storing the returning table into server memory
//        SqlDataReader dataReader = command.ExecuteReader();

//            QuestionModel qn = null;
 
//            //load into the result object the returned row from the database
//            if (dataReader.HasRows)
//            {
//                while (dataReader.Read())
//                {
//                    qn = new QuestionModel();

//                    qn.ArticleId = Convert.ToInt32(dataReader["ArticleID"]);
//                    qn.Body = dataReader["Body"].ToString();
//                    qn.CategoryId = Convert.ToInt32(dataReader["CategoryID"]);
//                    qn.PublishDate = Convert.ToDateTime(dataReader["PublishDate"]);
//                    qn.Title = dataReader["Title"].ToString();

//                    result.Add(qn);
//                }
//            }
//            return result;
//        }
 
 
//        public bool DeleteArticle(int ArticleID)
//{
//    bool result = false;

//    //Create the SQL Query for deleting an article
//    string sqlQuery = String.Format("delete from Article where ArticleID = {0}", ArticleID);

//    //Create and open a connection to SQL Server
//    SqlConnection connection = new SqlConnection(ConnectionString);
//    connection.Open();

//    //Create a Command object
//    SqlCommand command = new SqlCommand(sqlQuery, connection);

//    // Execute the command
//    int rowsDeletedCount = command.ExecuteNonQuery();
//    if (rowsDeletedCount != 0)
//        result = true;
//    // Close and dispose
//    command.Dispose();
//    connection.Close();
//    connection.Dispose();


//    return result;
//}
//    }
//}