using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QnA.Models
{
    public class QuestionModel
    {
        public int QuestionId { get; set; }
        public string Question { get; set; }
        public string Topic { get; set; }
        public string UserEmail { get; set; }
        public List<Solution> Solutions { get; set; } = new List<Solution>();
        public bool IsImage { get; set; }
        public string PostCreated { get; set; }
    }
    public class Solution
    {
        public int SolutionId { get; set; }
        public string Solutionstr { get; set; }
        public string SolutionImage { get; set; }
        public string By { get; set; }
        public string SolCreated { get; set; }
    }
}