const Connections = require("../models/Connections");
const Messages = require("../models/Messages");


function AddToConnections(user, user2) {
    return new Promise((resolve, reject) => {
        var connetion = new Connections({
            user: user,
            user2: user2,
            status1: "Active",
            status2:"Active"
        })

        connetion.save().then((res) => {
            resolve(res)
        }).catch((error) => {
            reject(error)
        })
    })
}

function ChangeConnectionState(connection,userx,new_state) {
    return new Promise((resolve, reject) => {
        try {
            var mp = await Connections.findOne({ _id: connection })
            var ress
            if (mp.user == userx) {
                ress = await Connections.updateOne({_id:connection},{status1:new_state})
            } else {
                ress = await Connections.updateOne({_id:connection},{status2:new_state})
            }
            resolve(ress);
        } catch (error) {
            reject(error)
        }
    })
}

function SaveNewMessage(connection,sender,message) {
    return new Promise((resolve, reject) => {
        var message = new Messages({
            connection: connection,
            sender: sender,
            message:message
        })

        message.save().then(res => {
            resolve(res)
        }).catch(error => {
            reject(error)
        })
    })
}

function GetSavedMessages(connection) {
    return new Promise((resolve, reject) => {
        Messages.find({ connection: connection }).then(res => {
            resolve(res)
        }).catch(error => {
            reject(error)
        })
    })
}

module.exports = { AddToConnections,ChangeConnectionState,SaveNewMessage,GetSavedMessages };