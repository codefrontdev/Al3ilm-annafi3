const globalErrorMiddleware = (err, req, res, next) => {
  // تعيين الحالة الافتراضية للخطأ
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // إذا كانت البيئة تطويرية، يتم إرسال خطأ شامل مع التفاصيل
  if (process.env.NODE_ENV !== "production") {
    sendErrorForDev(err, res);
  } else {
    sendErrorForProd(err, res);
  }
};

const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  let { statusCode, status, message } = err;

  // التعامل مع أخطاء معينة قد تكون غير آمنة أو تحتاج إلى معالجة خاصة
  if (err.isOperational === false) {
    // من الأفضل تسجيل الأخطاء غير التشغيلية بحيث يمكن معالجة الحالات الاستثنائية
    console.error("ERROR 💥:", err);
    statusCode = 500;
    status = "error";
    message = "Something went very wrong!";
  }

  return res.status(statusCode).json({
    status,
    message,
  });
};

module.exports = globalErrorMiddleware;
