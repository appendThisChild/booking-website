function checkIfOwner(req, res, next){
    if(req.user.isOwner){
        next()
    } else {
        res.status(401)
        return next(new Error("Not authorized"))
    }
}
function checkIfTherapist(req, res, next){
    if(req.user.isTherapist){
        next()
    } else {
        res.status(401)
        return next(new Error("Not authorized"))
    }
}
const mongoURI = 'mongodb://localhost:27017/matthew-sweetness'
const options = {
    useNewUrlParser: true, 
    useFindAndModify: false, 
    useCreateIndex: true,
    useUnifiedTopology: true
}


module.exports = { checkIfOwner, checkIfTherapist, mongoURI, options }