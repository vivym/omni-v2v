FROM python:3.11-slim as requirements

RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

RUN pip install --no-cache-dir poetry==1.6.1

WORKDIR /tmp

COPY poetry.lock pyproject.toml ./
RUN poetry export --output=requirements.txt && \
    poetry export --dev --output=requirements-dev.txt


FROM tiangolo/uvicorn-gunicorn:python3.11-slim as api

RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

COPY --from=requirements /tmp/requirements.txt /tmp/requirements-dev.txt /tmp/

RUN pip install --no-cache-dir --no-deps -r /tmp/requirements.txt -r /tmp/requirements-dev.txt

COPY . /app

WORKDIR /app

ENV MODULE_NAME=backend
ENV VARIABLE_NAME=app
