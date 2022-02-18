using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QnA.Models
{
    public class Notes
    {
        public int NoteId { get; set; }
        public string Topic { get; set; }
        public string Category { get; set; }
        public string NoteDescription { get; set; }
        public List<string> links { get; set; } = new List<string>();
        public string Owner { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}