# Используем базовый образ Python
FROM python:3.10

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем зависимости проекта и устанавливаем их
COPY website/requirements.txt .
RUN pip install -r requirements.txt

# Копируем исходный код Django приложения
COPY website/ .

# Запускаем Django сервер
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
