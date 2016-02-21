'use strict';

var n;
var m;
var T;

var l = [];
var k = [];

var x;
var y;

var alpha;
var beta;

function Speck(wordSize){

     // n = word size (16, 24, 32, 48, or 64)
    if(wordSize == 16 || wordSize == 24 || wordSize == 32 || wordSize == 48 || wordSize == 64){
        n = wordSize;
    }
    else{
        return false;    
    }
    
     /*
     *   m = number of key words must be
     *  4 if n = 16,
     *  3 or 4 if n = 24 or 32,
     *  2 or 3 if n = 48,
     *  2 or 3 or 4 if n = 64
     */
     switch(n){
         case 16:
             m = 4;
             break;
        case 24:
             m = 4;
             break;
        case 32:
             m = 4;
             break;
         case 48:
             m = 3;
             break;
         case 64:
             m = 4;
             break;
        default:
            return false;
    }
    
    /*
     *  T = number of rounds
     *  22 if n = 16
     *  22 or 23 if n = 24, m = 3 or 4
     *  26 or 27 if n = 32, m = 3 or 4
     *  28 or 29 if n = 48, m = 2 or 3
     *  32, 33, or 34 if n = 64, m = 2, 3, or 4
     */

    switch(n){
        case 16:
            T = 22;
            break;
        case 24:
            T = 23;
            break;
        case 32:
            T = 27;
            break;
        case 48:
            T = 29;
            break;
        case 64:
            T = 34;
            break;
        default:
            return false;
    }

    var i;	
    for(i = 0; i < T; i++){
   	k.push(0);
    }
    for(i = 0; i < (2*T); i++){
  	l.push(0)
    }
    
    if (n == 16){
        alpha = 7;
        beta = 2;
    }
    else{
        alpha = 8;
        beta = 3;
    }
    
};

Speck.prototype.encrypt = function(plainText){
    var i;
    var j;
    var cipherText = [];
    if((plainText.length % 2)!= 0){
        plainText.push(" ");
    }
    for(i = 0; i < plainText.length; i+=2){
        x = plainText[i];
        y = plainText[i+1];
               
        this._keyExpansion();
        for(j = 0; j <= T-1; j++) {
            x = (this._rotateRight(x, alpha) + y) ^ k[j];
            y = this._rotateLeft(y, beta) ^ x;
        }
        cipherText.push(x);
        cipherText.push(y);
    }
    return cipherText;
};

Speck.prototype.decrypt = function(cipherText){
    var i;
    var j;
    var plainText = [];
    for(i = 0; i < cipherText.length; i+=2){
        x = cipherText[i];
        y = cipherText[i+1];
        
        this._keyExpansion();
        for(j = T-1; j >= 0; j--) {
            y = this._rotateRight(x ^ y, beta);
            x = this._rotateLeft(y, beta) ^ x;
        }
        plainText.push(x);
        plainText.push(y);
    }
    return plainText;
};

Speck.prototype._keyExpansion = function(){
    var i;
    for(i = 0; i < T-2; i++) {
            l[i+m-1] = (k[i] + this._rotateRight(l[i], alpha)) ^ i;
            k[i+1] = this._rotateLeft(k[i], beta) ^ l[i+m-1];
    }
};


Speck.prototype._rotateLeft = function(number, amount){
    return number << amount | number >>> (32-amount);
};

Speck.prototype._rotateRight = function(number, amount){
    return number >>> amount | number << (32-amount);
};

module.exports = Speck;
