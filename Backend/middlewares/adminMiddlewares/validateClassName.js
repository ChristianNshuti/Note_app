const validateClassName = (req,res,next) => {
    const { className } = req.body;

    if(!className) {
        return res.status(400).json({error: 'Class name is required'});
    }

    const classNameRegex = /^Y[1-3][A-Z]$/;
    if(!classNameRegex.text(className)) {
        return res.status(400).json({error: 'Class name must be in the format Y1,Y2, or Y3 followed by as single letter (e.g., Y1A)'});
    }

    next();
};

module.exports = validateClassName;