-- Clean up incorrectly uploaded files with invalid filenames
DELETE FROM site_content 
WHERE section_id = 'puzzle_engine' 
AND page_id IN ('/*!', 'function CSpriteLibrary(){', 'var CANVAS_WIDTH = 1920;');