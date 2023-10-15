# Используем базовый образ Python
FROM python:3.10

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем зависимости Flask сервера и устанавливаем их
COPY vtb-api-mock/requirements.txt .
RUN pip install -r requirements.txt

# Копируем исходный код Flask приложения
COPY vtb-api-mock/ .

# Запускаем Flask сервер
CMD ["python", "app.py"]
