const  { validationResult } = require('express-validator');
const productsRepo = require('../../repositories/productsRepository')

module.exports = {
    handleErrors(templateFunc, dataCb){
        return async (req, res, next) => {
            const errors = validationResult(req);
            if(! errors.isEmpty()){
                let data = {};
                if(dataCb){
                    data = await dataCb(req);
                }
                return res.send(templateFunc({ errors, ...data }))
            }

            next();
        }
    },
    requireAuth(req, res, next){
        if(! req.session.userId) {
            return res.redirect('/signin');
        }

        next();
    },
    async requireProduct(req, res, next){
        const product = await productsRepo.getOne(req.params.id);
        if(!product){
            return res.send('product not found');
        }
        next();
    }
}