import numpy as np
hours_studied = float(input("ادخل عدد ساعات الدراسة: "))
attendance_percentage = float(input("ادخل نسبة الحضور: "))
pervious_grades = float(input("ادخل درجاتك السابقة: "))

#استخدام الذكاء الاصطناعي و تدريبه على القيم
X_train = np.array([[5, 80, 90], [8, 75, 88], [6, 85, 92]])
y_train = np.array([85, 88, 90])

#تمثيل الوحدة
X_train = np.c_[np.ones(X_train.shape[0]), X_train]
#معادلة الانحدار الخطي يدويا
theta = np.linalg.inv(X_train.T @ X_train) @ X_train.T @ y_train

#القيمة المستمرة
new_student = np.array([1, hours_studied, attendance_percentage, pervious_grades])
#عملية التنبؤ
prediction = new_student @ theta

print(f"توقع الدرجة: {prediction:.2f}")