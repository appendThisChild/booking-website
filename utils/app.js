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

module.exports = { checkIfOwner, checkIfTherapist }