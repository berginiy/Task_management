CREATE TABLE departments
(
    id          UUID        NOT NULL DEFAULT gen_random_uuid(),
    created_at  TIMESTAMP   NOT NULL,
    updated_at  TIMESTAMP   NOT NULL,
    name        VARCHAR(150) NOT NULL,
    description TEXT,
    head_user_id UUID,
    CONSTRAINT pk_departments PRIMARY KEY (id),
    CONSTRAINT uq_departments_name UNIQUE (name)
);

CREATE TABLE users
(
    id            UUID         NOT NULL DEFAULT gen_random_uuid(),
    created_at    TIMESTAMP    NOT NULL,
    updated_at    TIMESTAMP    NOT NULL,
    full_name     VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL,
    department_id UUID,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES departments (id)
);

ALTER TABLE departments
    ADD CONSTRAINT fk_departments_head_user FOREIGN KEY (head_user_id) REFERENCES users (id);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_department_id ON users (department_id);

CREATE TABLE tasks
(
    id                   UUID         NOT NULL DEFAULT gen_random_uuid(),
    created_at           TIMESTAMP    NOT NULL,
    updated_at           TIMESTAMP    NOT NULL,
    title                VARCHAR(500) NOT NULL,
    description          TEXT,
    status               VARCHAR(30)  NOT NULL DEFAULT 'NEW',
    is_urgently          BOOLEAN      NOT NULL DEFAULT FALSE,
    is_expired           BOOLEAN      NOT NULL DEFAULT FALSE,
    received_at          TIMESTAMP,
    deadline             TIMESTAMP,
    end_date             TIMESTAMP,
    new_deadline         TIMESTAMP,
    extension_requested  BOOLEAN      NOT NULL DEFAULT FALSE,
    extension_approved   BOOLEAN      NOT NULL DEFAULT FALSE,
    executor_full_name   VARCHAR(255),
    department_id        UUID,
    creator_id           UUID         NOT NULL,
    executor_id          UUID,
    CONSTRAINT pk_tasks PRIMARY KEY (id),
    CONSTRAINT fk_tasks_department FOREIGN KEY (department_id) REFERENCES departments (id),
    CONSTRAINT fk_tasks_creator    FOREIGN KEY (creator_id)    REFERENCES users (id),
    CONSTRAINT fk_tasks_executor   FOREIGN KEY (executor_id)   REFERENCES users (id)
);

CREATE INDEX idx_tasks_department_id ON tasks (department_id);
CREATE INDEX idx_tasks_creator_id    ON tasks (creator_id);
CREATE INDEX idx_tasks_executor_id   ON tasks (executor_id);
CREATE INDEX idx_tasks_status        ON tasks (status);
CREATE INDEX idx_tasks_deadline      ON tasks (deadline);
CREATE INDEX idx_tasks_is_expired    ON tasks (is_expired);

CREATE TABLE task_history
(
    id         UUID      NOT NULL DEFAULT gen_random_uuid(),
    task_id    UUID      NOT NULL,
    changed_by UUID      NOT NULL,
    old_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    comment    TEXT,
    changed_at TIMESTAMP  NOT NULL,
    CONSTRAINT pk_task_history PRIMARY KEY (id),
    CONSTRAINT fk_task_history_task       FOREIGN KEY (task_id)    REFERENCES tasks (id),
    CONSTRAINT fk_task_history_changed_by FOREIGN KEY (changed_by) REFERENCES users (id)
);

CREATE INDEX idx_task_history_task_id    ON task_history (task_id);
CREATE INDEX idx_task_history_changed_at ON task_history (changed_at);

CREATE TABLE task_notes
(
    id          UUID    NOT NULL DEFAULT gen_random_uuid(),
    created_at  TIMESTAMP NOT NULL,
    updated_at  TIMESTAMP NOT NULL,
    task_id     UUID    NOT NULL,
    author_id   UUID    NOT NULL,
    content     TEXT    NOT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT pk_task_notes PRIMARY KEY (id),
    CONSTRAINT fk_task_notes_task   FOREIGN KEY (task_id)   REFERENCES tasks (id),
    CONSTRAINT fk_task_notes_author FOREIGN KEY (author_id) REFERENCES users (id)
);

CREATE INDEX idx_task_notes_task_id   ON task_notes (task_id);
CREATE INDEX idx_task_notes_author_id ON task_notes (author_id);

CREATE TABLE task_executors
(
    id          UUID      NOT NULL DEFAULT gen_random_uuid(),
    task_id     UUID      NOT NULL,
    user_id     UUID      NOT NULL,
    assigned_at TIMESTAMP NOT NULL,
    is_active   BOOLEAN   NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_task_executors PRIMARY KEY (id),
    CONSTRAINT uq_task_executors_task_user UNIQUE (task_id, user_id),
    CONSTRAINT fk_task_executors_task FOREIGN KEY (task_id) REFERENCES tasks (id),
    CONSTRAINT fk_task_executors_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX idx_task_executors_task_id ON task_executors (task_id);
CREATE INDEX idx_task_executors_user_id ON task_executors (user_id);