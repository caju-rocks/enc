create table "public"."conquerors" (
    "id" bigint generated by default as identity not null,
    "first_name" character varying,
    "last_name" character varying,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."conquerors" enable row level security;

alter table "public"."profiles" add column "is_conqueror" boolean default false;

CREATE UNIQUE INDEX conquerors_pkey ON public.conquerors USING btree (id);

alter table "public"."conquerors" add constraint "conquerors_pkey" PRIMARY KEY using index "conquerors_pkey";

create policy "Enable insert for authenticated users only"
on "public"."conquerors"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable actions for users based on user_id"
on "public"."profiles"
as permissive
for all
to public
using ((auth.uid() = auth_user_id));


