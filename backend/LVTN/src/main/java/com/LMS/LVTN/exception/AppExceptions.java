package com.LMS.LVTN.exception;

public class AppExceptions extends RuntimeException{

    private Errorcode errorCode;
    private String customMessage;

    public AppExceptions(Errorcode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public AppExceptions(Errorcode errorCode, String customMessage) {
        super(customMessage);
        this.errorCode = errorCode;
        this.customMessage = customMessage;
    }

    public Errorcode getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(Errorcode errorCode) {
        this.errorCode = errorCode;
    }

    public String getCustomMessage() {
        return customMessage;
    }

    public void setCustomMessage(String customMessage) {
        this.customMessage = customMessage;
    }
}

