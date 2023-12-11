create table Rango(
id serial,
nombre varchar(255) not null,
elo float not null,
	constraint pk_Rango primary key(id)
);

create table Division(
id serial,
nombre varchar(255) not null,
eloEquivalente int not null,
	constraint pk_Division primary key(id)
);

create table Region(
id serial, 
nombre varchar(255) not null,
	constraint pk_Region primary key(id)
);


create table Team(
id serial,
nombreTeam varchar(255) not null,
rangoPromedio int null,
idDivision int null,
victorias int null,
derrotas int null,
idRegion int not null,
	constraint pk_Team primary key (id),
constraint fk_Team_Division foreign key(idDivision)
	references Division (id),
constraint fk_Team_Region foreign key(idRegion)
	references Region (id)
);

create table Player(
id serial,
nombre varchar(255) not null,
idRango int not null,
idTeam int not null,
	constraint pk_Player primary key(id),
constraint fk_player_Rango foreign key(idRango)
	references Rango (id),
constraint fk_player_Team foreign key(idTeam)
	references Team (id)
);

/*
create table User(
id serial,
username varchar(50) unique not null,
email varchar(100) not null,
password varchar(255) not null,
	constraint pk_User primary key(id),
);

insert into public.user (id, username, email, password) values (1, 'usuario1', 'usuario1@gmail.com', 'usuario159');

drop table public.player
drop table public.team

*/

--Datos de Rango---------------------------------------------------------

insert into rango (id,nombre,elo) values (100,'Iron 1',100);
insert into rango (id,nombre,elo) values (200,'Iron 2',200);
insert into rango (id,nombre,elo) values (300,'Iron 3',300);
insert into rango (id,nombre,elo) values (400,'Bronze 1',400);
insert into rango (id,nombre,elo) values (500,'Bronze 2',500);
insert into rango (id,nombre,elo) values (600,'Bronze 3',600);
insert into rango (id,nombre,elo) values (700,'Silver 1',700);
insert into rango (id,nombre,elo) values (800,'Silver 2',800);
insert into rango (id,nombre,elo) values (900,'Silver 3',900);
insert into rango (id,nombre,elo) values (1000,'Gold 1',1000);
insert into rango (id,nombre,elo) values (1100,'Gold 2',1100);
insert into rango (id,nombre,elo) values (1200,'Gold 3',1200);
insert into rango (id,nombre,elo) values (1300,'Platinum 1',1300);
insert into rango (id,nombre,elo) values (1400,'Platinum 2',1400);
insert into rango (id,nombre,elo) values (1500,'Platinum 3',1500);
insert into rango (id,nombre,elo) values (1600,'Diamond 1',1600);
insert into rango (id,nombre,elo) values (1700,'Diamond 2',1700);
insert into rango (id,nombre,elo) values (1800,'Diamond 3',1800);
insert into rango (id,nombre,elo) values (1900,'Ascendant 1',1900);
insert into rango (id,nombre,elo) values (2000,'Ascendant 2',2000);
insert into rango (id,nombre,elo) values (2100,'Ascendant 3',2100);
insert into rango (id,nombre,elo) values (2200,'Imnortal 1',2200);
insert into rango (id,nombre,elo) values (2300,'Inmortal 2',2300);
insert into rango (id,nombre,elo) values (2400,'Inmortal 3',2400);
insert into rango (id,nombre,elo) values (2500,'Radiant',2500);

--Regiones-------------------------------------------------------

insert into region (id,nombre) values (1,'Asia - Pacific');
insert into region (id,nombre) values (2,'North America');
insert into region (id,nombre) values (3,'Latin America');
insert into region (id,nombre) values (4,'Europe');
insert into region (id,nombre) values (5,'Korea');
insert into region (id,nombre) values ();

--Division----------------------------------------------------------

insert into division (id,nombre,eloequivalente) values (100,'Open 1',100);
insert into division (id,nombre,eloequivalente) values (200,'Open 2',200);
insert into division (id,nombre,eloequivalente) values (300,'Open 3',300);
insert into division (id,nombre,eloequivalente) values (400,'Open 4',400);
insert into division (id,nombre,eloequivalente) values (500,'Open 5',500);
insert into division (id,nombre,eloequivalente) values (600,'Intermediate 1',600);
insert into division (id,nombre,eloequivalente) values (700,'Intermediate 2',700);
insert into division (id,nombre,eloequivalente) values (800,'Intermediate 3',800);
insert into division (id,nombre,eloequivalente) values (900,'Intermediate 4',900);
insert into division (id,nombre,eloequivalente) values (1000,'Intermediate 5',1000);
insert into division (id,nombre,eloequivalente) values (1100,'Advanced 1',1100);
insert into division (id,nombre,eloequivalente) values (1200,'Advanced 2',1200);
insert into division (id,nombre,eloequivalente) values (1300,'Advanced 3',1300);
insert into division (id,nombre,eloequivalente) values (1400,'Advanced 4',1400);
insert into division (id,nombre,eloequivalente) values (1500,'Advanced 5',1500);
insert into division (id,nombre,eloequivalente) values (1600,'Elite 1',1600);
insert into division (id,nombre,eloequivalente) values (1700,'Elite 2',1700);
insert into division (id,nombre,eloequivalente) values (1800,'Elite 3',1800);
insert into division (id,nombre,eloequivalente) values (1900,'Elite 4',1900);
insert into division (id,nombre,eloequivalente) values (2000,'Elite 5',2000);
insert into division (id,nombre,eloequivalente) values (2100,'Contender 1',2100);
insert into division (id,nombre,eloequivalente) values (2200,'Contender 2',2200);
insert into division (id,nombre,eloequivalente) values (2300,'Contender 3',2300);
insert into division (id,nombre,eloequivalente) values (2400,'Contender 4',2400);
insert into division (id,nombre,eloequivalente) values (2500,'Contender 5',2500);

-- TRIGGERS ------------------------------------------------------------------------------------------------------------

-- Trigger de rango promedio del Team  --------------------------

CREATE OR REPLACE FUNCTION update_team_rangopromedio() RETURNS TRIGGER AS $$
BEGIN
    UPDATE Team
    SET rangopromedio = (SELECT SUM(idrango)/COUNT(*) FROM Player WHERE idteam = NEW.idteam)
    WHERE id = NEW.idteam;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_team_rangopromedio_trigger
AFTER INSERT ON Player
FOR EACH ROW EXECUTE PROCEDURE update_team_rangopromedio();


-- trigger de idDivisión del team

CREATE OR REPLACE FUNCTION update_team_iddivision() RETURNS TRIGGER AS $$
DECLARE
    new_iddivision INTEGER;
BEGIN
    IF (SELECT COUNT(*) FROM Player WHERE idteam = NEW.idteam) >= 7 THEN
        SELECT INTO new_iddivision ROUND((SELECT avg(rangopromedio) + 50 FROM Team WHERE id = NEW.idteam) / 100) * 100;
        IF EXISTS (SELECT 1 FROM Division WHERE id = new_iddivision) THEN
            UPDATE Team
            SET iddivision = new_iddivision
            WHERE id = NEW.idteam;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_team_iddivision_trigger
AFTER INSERT ON Player
FOR EACH ROW EXECUTE PROCEDURE update_team_iddivision()

-- INSERT PRUEBA ---------------------------------------------------------------------------------------------------------------------------

-- TEAMS (Asia) ------

insert into team (id, nombreteam, idregion) values (1, 'HomeIng', 1);
insert into team (id, nombreteam, idregion) values (2, 'Cookley', 1);
insert into team (id, nombreteam, idregion) values (3, 'Vagram', 1);
insert into team (id, nombreteam, idregion) values (4, 'Subin', 1);
insert into team (id, nombreteam, idregion) values (5, 'Hatity', 1);
insert into team (id, nombreteam, idregion) values (6, 'Quo Lux', 1);
insert into team (id, nombreteam, idregion) values (7, 'Wrapsafe', 1);
insert into team (id, nombreteam, idregion) values (8, 'Lotlux', 1);

-- Players --

insert into Player (id, nombre, idrango, idteam) values (1, 'bmaasz0', 2200, 1);
insert into Player (id, nombre, idrango, idteam) values (2, 'pahrens1', 1100, 1);
insert into Player (id, nombre, idrango, idteam) values (3, 'aroadnight2', 1600, 1);
insert into Player (id, nombre, idrango, idteam) values (4, 'mtrahear3', 1700, 1);
insert into Player (id, nombre, idrango, idteam) values (5, 'bairs4', 200, 1);
insert into Player (id, nombre, idrango, idteam) values (6, 'bhalksworth5', 1800, 1);
insert into Player (id, nombre, idrango, idteam) values (7, 'hlemme6', 2000, 1);
insert into Player (id, nombre, idrango, idteam) values (8, 'roheneghan7', 2400, 2);
insert into Player (id, nombre, idrango, idteam) values (9, 'pphare8', 1500, 2);
insert into Player (id, nombre, idrango, idteam) values (10, 'ehartnup9', 100, 2);
insert into Player (id, nombre, idrango, idteam) values (11, 'ehealda', 1900, 2);
insert into Player (id, nombre, idrango, idteam) values (12, 'seastmondb', 1100, 2);
insert into Player (id, nombre, idrango, idteam) values (13, 'jtimmsc', 700, 2);
insert into Player (id, nombre, idrango, idteam) values (14, 'adickinsd', 2300, 2);
insert into Player (id, nombre, idrango, idteam) values (15, 'kbindinge', 200, 3);
insert into Player (id, nombre, idrango, idteam) values (16, 'ldorsettf', 1500, 3);
insert into Player (id, nombre, idrango, idteam) values (17, 'mridewoodg', 1800, 3);
insert into Player (id, nombre, idrango, idteam) values (18, 'jrubbensh', 1600, 3);
insert into Player (id, nombre, idrango, idteam) values (19, 'grustadgei', 2400, 3);
insert into Player (id, nombre, idrango, idteam) values (20, 'wfouldj', 2100, 3);
insert into Player (id, nombre, idrango, idteam) values (21, 'adunkersleyk', 2000, 3);
insert into Player (id, nombre, idrango, idteam) values (22, 'pbeell', 400, 4);
insert into Player (id, nombre, idrango, idteam) values (23, 'cbenediktm', 2100, 4);
insert into Player (id, nombre, idrango, idteam) values (24, 'awoodthorpen', 1600, 4);
insert into Player (id, nombre, idrango, idteam) values (25, 'dmineso', 1600, 4);
insert into Player (id, nombre, idrango, idteam) values (26, 'tjennawayp', 2400, 4);
insert into Player (id, nombre, idrango, idteam) values (27, 'nshopcottq', 1700, 4);
insert into Player (id, nombre, idrango, idteam) values (28, 'abatherr', 1400, 4);
insert into Player (id, nombre, idrango, idteam) values (29, 'mbreads', 300, 5);
insert into Player (id, nombre, idrango, idteam) values (30, 'mmacparlandt', 2500, 5);
insert into Player (id, nombre, idrango, idteam) values (31, 'cyacobu', 600, 5);
insert into Player (id, nombre, idrango, idteam) values (32, 'rmeekingsv', 1500, 5);
insert into Player (id, nombre, idrango, idteam) values (33, 'ebedenhamw', 2400, 5);
insert into Player (id, nombre, idrango, idteam) values (34, 'bcawkerx', 1900, 5);
insert into Player (id, nombre, idrango, idteam) values (35, 'bantonyy', 1100, 5);
insert into Player (id, nombre, idrango, idteam) values (36, 'dfrankcomz', 900, 6);
insert into Player (id, nombre, idrango, idteam) values (37, 'qdelion10', 1200, 6);
insert into Player (id, nombre, idrango, idteam) values (38, 'hmacswayde11', 400, 6);
insert into Player (id, nombre, idrango, idteam) values (39, 'lplacido12', 1600, 6);
insert into Player (id, nombre, idrango, idteam) values (40, 'mdanilewicz13', 500, 6);
insert into Player (id, nombre, idrango, idteam) values (41, 'rjiruca14', 1900, 6);
insert into Player (id, nombre, idrango, idteam) values (42, 'dhalversen15', 500, 6);
insert into Player (id, nombre, idrango, idteam) values (43, 'rpozer16', 1600, 7);
insert into Player (id, nombre, idrango, idteam) values (44, 'auden17', 700, 7);
insert into Player (id, nombre, idrango, idteam) values (45, 'srollinshaw18', 700, 7);
insert into Player (id, nombre, idrango, idteam) values (46, 'clawleff19', 2000, 7);
insert into Player (id, nombre, idrango, idteam) values (47, 'cglendza1a', 2400, 7);
insert into Player (id, nombre, idrango, idteam) values (48, 'aabrehart1b', 2100, 7);
insert into Player (id, nombre, idrango, idteam) values (49, 'glawles1c', 1200, 7);
insert into Player (id, nombre, idrango, idteam) values (50, 'rpaye1d', 2000, 8);
insert into Player (id, nombre, idrango, idteam) values (51, 'cpurselow1e', 1700, 8);
insert into Player (id, nombre, idrango, idteam) values (52, 'rfoffano1f', 1700, 8);
insert into Player (id, nombre, idrango, idteam) values (53, 'jdunabie1g', 800, 8);
insert into Player (id, nombre, idrango, idteam) values (54, 'amakeswell1h', 100, 8);
insert into Player (id, nombre, idrango, idteam) values (55, 'ccowerd1i', 2000, 8);
insert into Player (id, nombre, idrango, idteam) values (56, 'cmcfee1j', 2400, 8);



select *
from team t 

select *
from player p 
