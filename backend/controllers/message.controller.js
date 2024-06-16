import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";


export const sendMessage = async (req,res)=>{
    try{
  const {id: receiverId}= req.params;
  const senderId= req.user._id;
  const {message}= req.body;

  let conversation = await Conversation.findOne({
    participants :{ $all : [senderId,receiverId]

    }
  })
  if(!conversation){
    conversation = await Conversation.create({
       participants :[senderId,receiverId]
    })


  }
  const newMessage = new Message({
    senderId,
    receiverId,
    message,
  })

  if(newMessage){
    conversation.messages.push(newMessage._id);

  }
  
// this will run in parallel , better approach than previous one:
  await Promise.all([conversation.save(), newMessage.save()]);

  
  res.status(201).json(newMessage);

    }
    
    catch(error){
console.log("error in messagecontroller",error.message);
res.status(400).json({error:"internal server error"});
    }
}


export const getMessages = async (req,res)=>{
    try{
    const {id: usertochatId}= req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
        participants: {$all:[senderId,usertochatId]}
    }).populate("messages");// this populate method is used to get messages bw sender and receiver, without this i was not able to get messages.
    if(!conversation) res.status(200).json([]);
    const messages = conversation.messages;
            res.status(200).json(messages);
    
}

catch(error){
    console.log("error in get messages controller",error.messages);
    res.status(400).json({error:"internal server error"});
}
}