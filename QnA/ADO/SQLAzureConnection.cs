using Newtonsoft.Json;
using BlobApp.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using QnA.Models;

namespace OneSourceService.ADO
{
    public class SQLAzureConnection
    {

        public SQLResult ExecuteQuery(string constr,string query,bool IsSelectQuery)
        {
            DataTable dt = new DataTable(); object returnvalue;
            try
            {
                using (SqlConnection conn = new SqlConnection(constr))
                {
                    conn.Open();
                        if (IsSelectQuery)
                        {
                            using (SqlDataAdapter a = new SqlDataAdapter(query, conn))
                            {
                                a.Fill(dt);
                                returnvalue = dt;
                            }
                        }
                        else
                        {
                            SqlCommand cmd = conn.CreateCommand();
                            cmd.CommandText = query;
                            returnvalue = cmd.ExecuteScalar();
                            conn.Close();
                    }
                    conn.Close();
                }
                return new SQLResult() { Status = true, Result = JsonConvert.SerializeObject(dt) };
            }
            catch (Exception ex)
            {
                return new SQLResult() { Status = false, Result = ex.Message };
            }
        }
       

    }
}