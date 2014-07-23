"use strict";

var ApiController;

/**
 * Controller for the micro-API
 * @param app
 * @constructor
 */
ApiController =  function (app)
{

};

/**
 * Show a basic message
 *
 * @param res
 * @param req
 * @param next
 */
ApiController.prototype.getIndex = function (res, req, next) {
    res.headers['Content-Type'] = 'application/json';

    return res.write(JSON.stringify({
        status: 'success',
        message: 'This is NexusConfig v1'
    }));
};

/**
 * GET /v1/fetch
 * Handles the only endpoint provided by this API
 *
 * @param res
 * @param req
 * @param next
 */
ApiController.prototype.getFetch = function (res, req, next) {

};

module.exports = ApiController;