# Используем базовый образ Python
FROM python:3.10

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем зависимости Flask сервера и устанавливаем их
COPY ml_server/requirements.txt .
RUN pip install -r requirements.txt

# Копируем исходный код Flask приложения
COPY ml_server/ .

# Запускаем Flask сервер
CMD ["python", "app.py"]
