using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QnA.Models
{
    public class Sqlcommand
    {
        public int CommandId { get; set; }
        public string Command { get; set; }
        public bool Public { get; set; }
        public string Owner { get; set; }
        public string Pin { get; set; }

    }
}