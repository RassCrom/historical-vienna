-- Buildings
CREATE TABLE buildings AS
SELECT
    p.fid, p.geom, p."addr:housenumber", p."addr:street", p.amenity, p.architect,
    p.building, p."building:levels", p."description:en", p.height, p.name,
    p.start_date, p.tourism, p."building:material", p.old_name,
    p."roof:levels", p.description, p."building:architecture"
FROM osm_polygons AS p
JOIN "vc-4-postgis" AS v
  ON ST_Intersects(p.geom, v.geom)
WHERE 
    (
        p.amenity IN ('theatre', 'townhall', 'place_of_worship', 'monastery', 'arts_centre')
        OR p.building IN ('cathedral', 'church', 'government', 'monastery', 'museum', 'synagogue', 'public')
        OR p.tourism IN ('attraction', 'museum')
    ) // filtering by attributes
    AND p.building IS NOT NULL
    AND p.building <> '';

-- Monuments
CREATE TABLE monuments AS
SELECT
    p.fid, p.geom, p."addr:housenumber", p."addr:street", p.heritage, p.architect,
    p."architect:wikidata", p.historic, p."description:en", p.height, p.name,
    p.start_date, p.tourism, p."artist_name", p.old_name,
    p."wikidata", p.description, p."year_of_construction"
FROM osm_polygons AS p
JOIN "vc-4-postgis" AS v
  ON ST_Intersects(p.geom, v.geom)
WHERE 
    (
        p.historic IN ('memorial', 'monument')
    )
    AND p.name IS NOT NULL
    AND p.name <> '';

-- Updating buildings and monuments columns
UPDATE buildings
SET year_i = SUBSTRING(start_date, 1, 4)::double precision
WHERE SUBSTRING(start_date, 1, 1) NOT IN ('C')

UPDATE monuments
SET year_i = SUBSTRING(start_date, 1, 4)::double precision
WHERE SUBSTRING(start_date, 1, 1) NOT IN ('C')

-- Updating buildings column
UPDATE your_table
SET year_i = CEIL((
    SPLIT_PART(year_s, '-', 1)::int + 
    SPLIT_PART(year_s, '-', 2)::int
) / 2.0)
WHERE year_i IS NULL AND year_s ~ '^\d{4}-\d{4}$';


-- Parks
CREATE TABLE parks AS
SELECT
    p.fid, p.geom, p."addr:housenumber", p."addr:street", p.amenity, p.architect,
    p.building, p."building:levels", p."description:en", p.height, p.name,
    p.start_date, p.tourism, p."building:material", p.old_name,
    p."roof:levels", p.description, p."building:architecture"
FROM osm_polygons AS p
JOIN "vc-4-postgis" AS v
  ON ST_Intersects(p.geom, v.geom)
WHERE 
  (
    p.tourism = 'yes' 
    OR (p.leisure IN ('park', 'garden') 
    AND (p.access IS NULL 
    OR p.access NOT IN ('private', 'no')))
  );

-- Places
CREATE TABLE places AS
SELECT
    p.fid, p.geom, p."addr:housenumber", p."addr:street", p.amenity, p.historic,
    p.wikidata, p.wikipedia, p."description:en", p.fee, p.name,
    p.start_date, p.heritage, p.museum, p."artist:wikidata",
    p."artist_name", p.description, p.artwork_type, p.memorial
FROM osm_points AS p
JOIN "vc-4-postgis" AS v
  ON ST_Intersects(p.geom, v.geom)
WHERE (
        p.historic in ('memorial', 'monument')
        or p.artwork_type in ('statue', 'bust')
        or p.memorial in ('plaque', 'statue', 'bust') 
      );