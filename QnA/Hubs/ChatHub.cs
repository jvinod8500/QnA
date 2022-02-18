using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace QnA.Hubs
{
    public class ChatHub : Hub
    {
        public void sendMessage(string message)
        {
            // Call the addNewMessageToPage method to update clients.
            Clients.All.sendMessage(message);
        }
        public void Send(string name, string message,string qid)
        {
            // Call the addNewMessageToPage method to update clients.
            Clients.All.ReceiveComment(name, message,qid);
        }
        public void typing(bool Typing,string user,string ele)
        {
            // Call the addNewMessageToPage method to update clients.
            Clients.All.Typereceive(Typing,user,ele);
        }
    }
}