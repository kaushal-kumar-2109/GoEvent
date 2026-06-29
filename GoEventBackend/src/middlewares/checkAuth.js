const CheckUserAuth = async (req, res, next) => {
    try {

        console.log(req.cookies);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: err.message || err
        });
    }
};

module.exports = { CheckUserAuth };