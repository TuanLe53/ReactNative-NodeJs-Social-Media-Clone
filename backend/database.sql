CREATE TABLE account(
    id uuid DEFAULT uuid_generate_v4 (),
    username VARCHAR(125) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    pw VARCHAR(125) NOT NULL,
    bio TEXT,
    avatar VARCHAR,
    cover_photo VARCHAR,
    acc_location VARCHAR(125),
    PRIMARY KEY (id)
);

CREATE TABLE follow(
    user_id uuid NOT NULL REFERENCES account(id),
    follower uuid NOT NULL REFERENCES account(id)
);

CREATE TABLE Refresh_Token(
    account_id uuid NOT NULL REFERENCES account(id),
    refresh_token VARCHAR NOT NULL,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 DAY',
    PRIMARY KEY (account_id)
);

CREATE TABLE Post(
    id uuid DEFAULT uuid_generate_v4 (),
    content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by uuid NOT NULL REFERENCES account(id),
    PRIMARY KEY (id)
);

CREATE TABLE Post_Image(
    post_id uuid NOT NULL REFERENCES post(id),
    img_url VARCHAR
);

CREATE TABLE like_post(
    post_id uuid NOT NULL REFERENCES post(id),
    user_id uuid NOT NULL REFERENCES account(id)
);

CREATE TABLE comment(
    id uuid DEFAULT uuid_generate_v4 (),
    comment TEXT NOT NULL,
    post_id uuid NOT NULL REFERENCES post(id),
    created_by uuid NOT NULL REFERENCES account(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    parent_id uuid REFERENCES comment(id),
    PRIMARY KEY (id)
);

CREATE TABLE room(
    id uuid DEFAULT uuid_generate_v4(),
    PRIMARY KEY (id)
);

CREATE TABLE room_member(
    room_id uuid NOT NULL REFERENCES room(id),
    user_id uuid NOT NULL REFERENCES account(id),
    PRIMARY KEY (room_id, user_id)
);

CREATE TABLE message(
    room_id uuid NOT NULL REFERENCES room(id),
    message_text TEXT,
    created_by uuid NOT NULL REFERENCES account(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);


SELECT room_id AS id, user_id, username, avatar FROM room_member LEFT JOIN account ON room_member.user_id = account.id WHERE room_id IN
(SELECT room_id FROM room_member WHERE user_id = 'ad181f8f-4f3b-4220-b5ad-62eeef524782')
AND
user_id != 'ad181f8f-4f3b-4220-b5ad-62eeef524782';