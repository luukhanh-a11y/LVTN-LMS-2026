package com.LMS.LVTN.exception;

public class AppExceptions extends RuntimeException{

    private Errorcode errorCode;

    public AppExceptions(Errorcode errorCode) {
        this.errorCode = errorCode;
    }

    public Errorcode getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(Errorcode errorCode) {
        this.errorCode = errorCode;
    }
}
