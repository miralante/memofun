# mapa_mundi_capitales — conceptos ya cubiertos

> Registro de trabajo del agente de IA (ver CLAUDE.md → "Generating deck content" paso 7).
> No lo lee la app ni el service worker; no necesita subir VERSION en sw.js.

- Qué es la capital de un país (introducción): mapa_mundi_capitales.json ("casa central" de una empresa)
- España → Madrid: mapa_mundi_capitales.json (corazón de estrella, caminos en todas direcciones)
- Francia → París: mapa_mundi_capitales.json (Torre Eiffel como firma)
- Italia → Roma: mapa_mundi_capitales.json (libro de historia al aire libre, Vaticano)
- Alemania → Berlín: mapa_mundi_capitales.json (el Muro, línea que separaba familias)
- Reino Unido → Londres: mapa_mundi_capitales.json (Big Ben, reloj gigante)
- Portugal → Lisboa: mapa_mundi_capitales.json (calles como olas de piedra, tranvías amarillos)
- Rusia → Moscú: mapa_mundi_capitales.json (Plaza Roja, cuadro pintado en piedra)
- Estados Unidos → Washington D.C.: mapa_mundi_capitales.json (no es Nueva York, capitán no es la estrella)
- Canadá → Ottawa: mapa_mundi_capitales.json (no es Toronto, punto medio justo)
- México → Ciudad de México: mapa_mundi_capitales.json (construida sobre un lago, antigua Tenochtitlan)
- Brasil → Brasilia: mapa_mundi_capitales.json (no es Río, ciudad construida desde cero en forma de avión)
- Argentina → Buenos Aires: mapa_mundi_capitales.json (La Boca, caja de lápices de colores)
- Japón → Tokio: mapa_mundi_capitales.json (luces de neón, mapa de estrellas hecho por personas)
- China → Pekín: mapa_mundi_capitales.json (Ciudad Prohibida, secreto guardado siglos)
- India → Nueva Delhi: mapa_mundi_capitales.json (junto a la vieja Delhi, dos hermanas)
- Egipto → El Cairo: mapa_mundi_capitales.json (pirámides de Guiza a las afueras)
- Sudáfrica → tres capitales (Pretoria/Ciudad del Cabo/Bloemfontein): mapa_mundi_capitales.json (trabajo de un jefe repartido en tres oficinas)
- Australia → Canberra: mapa_mundi_capitales.json (no es Sídney, árbitro entre dos ciudades rivales)
- Suecia → Estocolmo: mapa_mundi_capitales_2.json (catorce islas, rompecabezas de piedra y agua)
- Noruega → Oslo: mapa_mundi_capitales_2.json (esquiar cerca del centro, ciudad cara)
- Dinamarca → Copenhague: mapa_mundi_capitales_2.json (más bicicletas que habitantes, la Sirenita)
- Finlandia → Helsinki: mapa_mundi_capitales_2.json (días cortos de luz en invierno, aurora boreal)
- Polonia → Varsovia: mapa_mundi_capitales_2.json (casco antiguo reconstruido piedra a piedra tras la guerra)
- Arabia Saudí → Riad: mapa_mundi_capitales_2.json (pueblo a metrópoli en pocas décadas)
- Emiratos Árabes Unidos → Abu Dabi: mapa_mundi_capitales_2.json (no es Dubái)
- Turquía → Ankara: mapa_mundi_capitales_2.json (no es Estambul, director de orquesta que no es la estrella)
- Tailandia → Bangkok: mapa_mundi_capitales_2.json (canales, templos dorados)
- Vietnam → Hanói: mapa_mundi_capitales_2.json (no es Ciudad Ho Chi Minh)
- Indonesia → Yakarta: mapa_mundi_capitales_2.json (ciudad que se hunde, nueva capital Nusantara en construcción)
- Corea del Sur → Seúl: mapa_mundi_capitales_2.json (río Han, tablero electrónico de noche)
- Marruecos → Rabat: mapa_mundi_capitales_2.json (no es Casablanca)
- Nigeria → Abuya: mapa_mundi_capitales_2.json (no es Lagos, construida como Brasilia)
- Kenia → Nairobi: mapa_mundi_capitales_2.json (parque nacional junto a los rascacielos)
- Perú → Lima: mapa_mundi_capitales_2.json (cielo nublado que casi nunca llueve)
- Chile → Santiago: mapa_mundi_capitales_2.json (Andes nevados de fondo)
- Nueva Zelanda → Wellington: mapa_mundi_capitales_2.json (no es Auckland, capital más ventosa)

- Cuba → La Habana: mapa_mundi_capitales_3.json (coches antiguos de los años cincuenta)
- Costa Rica → San José: mapa_mundi_capitales_3.json (valle rodeado de volcanes)
- Panamá → Ciudad de Panamá: mapa_mundi_capitales_3.json (rascacielos junto al canal)
- República Dominicana → Santo Domingo: mapa_mundi_capitales_3.json (ciudad europea más antigua habitada de América)
- Colombia → Bogotá: mapa_mundi_capitales_3.json (más de 2.600 m de altitud)
- Ecuador → Quito: mapa_mundi_capitales_3.json (primera ciudad Patrimonio de la Humanidad de la UNESCO)
- Uruguay → Montevideo: mapa_mundi_capitales_3.json (casi la mitad de la población del país)
- Países Bajos → Ámsterdam: mapa_mundi_capitales_3.json (capital, pero el gobierno trabaja desde La Haya)
- Suiza → Berna: mapa_mundi_capitales_3.json (no es Zúrich; foso de osos)
- Irlanda → Dublín: mapa_mundi_capitales_3.json (ciudad natal de muchos escritores)
- Bélgica → Bruselas: mapa_mundi_capitales_3.json (sede de instituciones de la UE)
- Nepal → Katmandú: mapa_mundi_capitales_3.json (punto de partida hacia el Everest)
- Filipinas → Manila: mapa_mundi_capitales_3.json (una de las más densas del mundo)
- Pakistán → Islamabad: mapa_mundi_capitales_3.json (no es Karachi; ciudad planificada)
- Argelia → Argel: mapa_mundi_capitales_3.json (la Casbah, laberinto blanco)
- Etiopía → Adís Abeba: mapa_mundi_capitales_3.json (sede de la Unión Africana)

Patrón "capital ≠ ciudad más famosa" ya usado en: EE. UU./Nueva York,
Canadá/Toronto, Brasil/Río, Australia/Sídney (baraja 1); Emiratos/Dubái,
Turquía/Estambul, Vietnam/Ciudad Ho Chi Minh, Marruecos/Casablanca,
Nigeria/Lagos, Nueva Zelanda/Auckland (baraja 2); Suiza/Zúrich,
Pakistán/Karachi, Países Bajos (capital formal vs. sede del gobierno)
(baraja 3). Para una cuarta baraja, buscar también países que rompan
la expectativa contraria (capital que SÍ es la ciudad más grande y
famosa, para no generalizar de más), más regiones aún sin cubrir:
Venezuela, Bolivia, resto de Europa del Este, Escandinavia restante.
