create table Campeones (
	nombre varchar(50) primary key,
	faction varchar(50),
	urlFoto text,
	unique(nombre)
);

create table Habilidades (
	nombreFK varchar(50) REFERENCES Campeones(nombre),
	nombre varchar(100),
	descripcion text,
	urlLogo text
);

create table Aspectos (
	nombreFK varchar(50) REFERENCES Campeones(nombre),
	urlFoto text	
);