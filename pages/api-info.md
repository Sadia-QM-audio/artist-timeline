---
layout: page
title: New
permalink: /new
---

[comment]: # The page exists, but it does not show up on the home page

# CMA API

[Link](https://openaccess-api.clevelandart.org/)

## Summary of GET requests:

Get a list of artworks and associated metadata and image links based on a search term.

https://openaccess-api.clevelandart.org/api/artworks/
  
Example Request

https://openaccess-api.clevelandart.org/api/artworks/?q=song%20xu&skip=2&limit=1&indent=1

___

GET Artwork (Specific)
Get a specific artwork record by and id parameter, which can be the artwork’s Athena id or accession number

https://openaccess-api.clevelandart.org/api/artworks/{id}

Example Request

https://openaccess-api.clevelandart.org/api/artworks/1953.424?indent=1

___

GET Creators (Search)
Get a list of creators and their associated metadata and artworks based on a search terms.

https://openaccess-api.clevelandart.org/api/creators/

Example Request

https://openaccess-api.clevelandart.org/api/creators/?name=smith&birth_year_after=1900&limit=1&indent=1

___

GET Creator (Specific)
Get a specific creator record by and id parameter.

https://openaccess-api.clevelandart.org/api/creators/{id}

Example Request

https://openaccess-api.clevelandart.org/api/creators/7978?indent=1

___

GET exhibitions (Search)
Get a list of artworks and associated metadata and image links based on a search term.

https://openaccess-api.clevelandart.org/api/exhibitions/

Example Request

https://openaccess-api.clevelandart.org/api/exhibitions/?title=picasso&venue=cleveland&opened_after=2000-01-01&limit=1

___

GET Exhibition (Specific)
Get a specific exhibition record by and id parameter.

https://openaccess-api.clevelandart.org/api/exhibitions/{id}

Example Request

https://openaccess-api.clevelandart.org/api/exhibitions/453138?indent=1

___

GET JPEG and Caption
Return the print- and web-resolution images, as well as a text file containing the caption or "tombstone" information for the artwork. This is accomplished by pulling the tombstone and image urls directly from the API database, writing them to a zipfile, and returning it in the API response.

Example Request

https://openaccess-api.clevelandart.org/api/collectiononline/jpeg_and_caption/1974.1

___

GET High-Resolution TIFF
Return the high-resolution TIFF of the artwork. This simply redirects the user to the TIFF location in the CDN.

Example Request

https://openaccess-api.clevelandart.org/api/collectiononline/tiff/1974.1

___

GET Metadata Only
Return a formatted plain-text file with all the API data for the artwork. This is accomplished by pulling all artwork data directly from the API database, putting it into human-readable format via a Jinja template, and returning as a text-file.

Example Request

https://openaccess-api.clevelandart.org/api/collectiononline/metadata/1974.1