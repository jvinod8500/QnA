using Newtonsoft.Json;
using QnA.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SQLite;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;

namespace OneSourceService.ADO
{
    public class SQLLiteQnA
    {
        private static string DatabaseFile = Path.GetDirectoryName(Assembly.GetExecutingAssembly().CodeBase).Replace("file:\\", "").Replace("bin", "") + "SQLliteQnA.db";
        private string DatabaseSource = "data source=" + Path.GetDirectoryName(Assembly.GetExecutingAssembly().CodeBase).Replace("file:\\", "").Replace("bin", "") + "SQLliteQnA.db";

        public bool AddCommand(Sqlcommand q)
        {
            try
            {
                q.Command = q.Command.Replace("'", "''");
                //Match match = Regex.Match(q.Command, @"'([^']*)");
                //if (match.Success)
                //{
                //    q.Command = q.Command.Replace(match.Groups[1].Value, match.Groups[1].Value.Replace("_"," ")) ;
                //}
                using (var connection = new SQLiteConnection(DatabaseSource))
                {
                    connection.Open();
                    using (var command = new SQLiteCommand(connection))
                    {

                        command.CommandText = "select Max(CommandId) from Sqlcommand";
                        var maxid = command.ExecuteScalar();
                        int id = maxid.ToString() == "" ? 1 : Convert.ToInt32(maxid) + 1;
                        if(q.Owner==null)
                            command.CommandText = "Insert into Sqlcommand values(" + id + ",'" + q.Command + "','Y','" + q.Owner + "','" + q.Pin+"')";
                       else
                            command.CommandText = "Insert into Sqlcommand values(" + id + ",'" + q.Command + "','N','" + q.Owner + "','" + q.Pin + "')";
                        int result = Convert.ToInt16(command.ExecuteNonQuery());
                        connection.Close();
                        if (result == 1)
                            return true;
                        else return false;
                    }
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                return false;
            }
        }
        public bool AddOwner(string Owner,string Pin)
        {
            try
            {
                using (var connection = new SQLiteConnection(DatabaseSource))
                {
                    //connection.Open();
                    //using (var command = new SQLiteCommand(connection))
                    //{
                    //    command.CommandText = "select * from Owner";
                    //    SQLiteDataAdapter da = new SQLiteDataAdapter(command);
                    //    DataTable dt = new DataTable();

                    //    da.Fill(dt);
                    //    var returnvalue = JsonConvert.SerializeObject(dt);
                    //    connection.Close();
                    //}
                    using (var command = new SQLiteCommand(connection))
                    {
                        connection.Open();
                        command.CommandText = "select Count(*) from Owner where OwnerName='"+ Owner +"' and Pin='"+Pin+"'";
                        int count = Convert.ToInt32(command.ExecuteScalar());
                        if (count > 0) return true;
                        command.CommandText = "select Max(OwnerId) from Owner";
                        var maxid = command.ExecuteScalar();
                        int id = maxid.ToString() == "" ? 1 : Convert.ToInt32(maxid) + 1;
                        command.CommandText = "Insert into Owner values(" + id + ",'" + Owner + "','" + Pin + "')";
                        int result = Convert.ToInt16(command.ExecuteNonQuery());
                        connection.Close();
                        if (result == 1)
                            return true;
                        else return false;
                    }
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                return false;
            }
        }
       
        public bool CreateTable()
        {
            try
            {
                using (var connection = new SQLiteConnection(DatabaseSource))
                {
                    connection.Open();
                    using (var command = new SQLiteCommand(connection))
                    {
                      
                        command.CommandText = "create table Notes(NoteId int,Topic varchar(20),Category varchar(50),NoteDescription varchar(100),links varchar(2000),Owner varchar(30),CreatedDate varchar(30))";
                        int result = Convert.ToInt16(command.ExecuteNonQuery());
                        connection.Close();
                        if (result == 1)
                            return true;
                        else return false;
                    }
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                return false;
            }
        }

        public SQLResult GetCommands(string Owner, string Pin)
        {
            DataTable dt = new DataTable(); string returnvalue = "";
            try
            {
                using (var connection = new SQLiteConnection(DatabaseSource))
                {
                    connection.Open();
                    using (var command = new SQLiteCommand(connection))
                    {
                        command.CommandText = "Select * from Sqlcommand where (owner='"+Owner+"' and pin='"+Pin+"') or publicAccess='Y'";
                        SQLiteDataAdapter da = new SQLiteDataAdapter(command);
                        da.Fill(dt);
                        returnvalue = JsonConvert.SerializeObject(dt);
                        connection.Close();
                    }
                }
                return new SQLResult() { Status = true, Result = returnvalue };
            }
            catch (Exception ex)
            {
                return new SQLResult() { Status = false, Result = ex.Message };
            }
        }

        public bool RunBulkInsert(string query)
        {
            try
            {
                using (var connection = new SQLiteConnection(DatabaseSource))
                {
                    connection.Open();
                    using (var command = new SQLiteCommand(connection))
                    {
                        command.CommandText = query;
                        command.ExecuteNonQuery();
                        connection.Close();
                    }
                }
                return true;
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                return false;
            }
        }
        public bool ReinitializeSQLLiteDB()
        {
            try
            {
                // Recreate database if already exists
                if (File.Exists(DatabaseFile))
                {
                    File.Delete(DatabaseFile);
                    SQLiteConnection.CreateFile(DatabaseFile);
                }
                return true;
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                return false;
            }
        }
        public static void CheckAndCreateDB()
        {
            try
            {
                if (!File.Exists(DatabaseFile))
                {
                    SQLiteConnection.CreateFile(DatabaseFile);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}