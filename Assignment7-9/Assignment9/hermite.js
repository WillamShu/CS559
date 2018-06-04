// Global constructor
var HermiteCurve = undefined;

(function () {
    "use strict";

    HermiteCurve = function HermiteCurve(pointData) {
        // The point data should be of the form [P0, P1, D1, D2]
        // and each of P0,P1,D0,D2 should be of the form [x, y, z]
        this.P0 = pointData[0];
        this.P1 = pointData[1];
        this.D0 = pointData[2];
        this.D1 = pointData[3];
    }
    HermiteCurve.prototype.hermite = function (t) {
        return [
               2*t*t*t-3*t*t+1,
               t*t*t-2*t*t+t,
               -2*t*t*t+3*t*t,
               t*t*t-t*t
               ];
    }
    HermiteCurve.prototype.hermiteDerivative = function (t) {
        return [
               6*t*t-6*t,
               3*t*t-4*t+1,
               -6*t*t+6*t,
               3*t*t-2*t
               ];
    }
    HermiteCurve.prototype.value = function (t) {
        var b = this.hermite(t);
        var result=twgl.v3.mulScalar(this.P0,b[0]);
        twgl.v3.add(twgl.v3.mulScalar(this.D0,b[1]),result,result);
        twgl.v3.add(twgl.v3.mulScalar(this.P1,b[2]),result,result);
        twgl.v3.add(twgl.v3.mulScalar(this.D1,b[3]),result,result);
        return result;
    }
    HermiteCurve.prototype.dtValue = function (t) {
        var b = this.hermiteDerivative(t);
        var result=twgl.v3.mulScalar(this.P0,b[0]);
        twgl.v3.add(twgl.v3.mulScalar(this.D0,b[1]),result,result);
        twgl.v3.add(twgl.v3.mulScalar(this.P1,b[2]),result,result);
        twgl.v3.add(twgl.v3.mulScalar(this.D1,b[3]),result,result);
        return result;
    }
})();