import { statusCodes } from './statusCodes.js'

export default function(options) {
    let statusCodesResponseType = {}

    if (options.forced) {
        for (let key in options.forced) {
            statusCodes[key] = options.forced[key].message
            statusCodesResponseType[key] = options.forced[key].type
        }
    }

    return function(req, res, next) {
        res.statusResponse = ({code, message, data}) => {
            if (!code) {throw new Error("'code' was never defined")}
            if (code>600) {throw new Error("'code' was over 600")}
            
            let statusResponse = {
                statusCode: code,
                path: req.path
            }
    
            if (code<400 && !statusCodesResponseType[code]) {
                statusResponse.success = statusCodes[code];
            } else if (code>(400-1) && code<600 && !statusCodesResponseType[code]) {
                statusResponse.error = statusCodes[code];
            }
            
            if (statusCodesResponseType[code]) {
                statusResponse[statusCodesResponseType[code]] = statusCodes[code]
            }
            
            if (message) {
                statusResponse.message = message
            }
            
            if (!statusCodesResponseType[code] && !statusCodes[code]) {throw new Error("Error code "+code+" does not exist")}

            res.status(code).json(statusResponse)
        }
    
        next()
    }
}