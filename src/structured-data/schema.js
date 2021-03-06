import { stripMillisecondsFromTime } from "../utils";
import { get } from 'lodash';
export const getSchemaContext = { "@context": "http://schema.org" }

export function getSchemaType(type) {
  return { "@type": type };
}

export function getSchemaPerson(name) {
  return Object.assign({},
    getSchemaType("Person"),
    {
      "givenName": name,
      "name": name
    }
  )
}

export function getSchemaFooter({cssSelector}) {
  return cssSelector ? Object.assign({},
    getSchemaContext,
    getSchemaType("WPFooter"),
    {
      "cssSelector": cssSelector
    }
  ) : {}
}

export function getSchemaHeader({cssSelector}) {
  return cssSelector ? Object.assign({},
    getSchemaContext,
    getSchemaType("WPHeader"),
    {
      "cssSelector": cssSelector
    }
  ) : {};
}

export function getSchemaBlogPosting(card = {}, author = {}, headline = '', image = '', structuredData = {}, story = {}) {
  const {website : {url = ''} = {}} = structuredData;
  return Object.assign({},
    getSchemaType("BlogPosting"),
    getSchemaMainEntityOfPage(`${url}/${story.slug}`),
    getSchemaPublisher(structuredData.organization),
    {
      "dateModified": stripMillisecondsFromTime(new Date(card['card-updated-at'])),
      "dateCreated": stripMillisecondsFromTime(new Date(card['card-added-at'])),
      "datePublished": stripMillisecondsFromTime(new Date(card['card-updated-at'])),
      "author": author,
      "headline": headline,
      "image": image
    }
  );
}

export function getSchemaPublisher(organization) {
  return {
    "publisher": Object.assign({},
      getSchemaType("Organization"),
      getSchemaContext,
      organization
    )
  }
}

export function getSchemaMainEntityOfPage(id) {
  return {
    "mainEntityOfPage": Object.assign({},
      getSchemaType("WebPage"),
      {"@id": id }
    )
  }
}

export function getSchemaMovieReview(movieObject={}) {
  const movieCreatedAt = get(movieObject, ["created-at"], null);
  const actors = get(movieObject,["actors"], []).map((actor) => getSchemaPerson(actor.name));
  const directors = get(movieObject,["directors"], []).map((director) => getSchemaPerson(director.name));
  const producers = get(movieObject,["producers"], []).map((producer) => getSchemaPerson(producer.name));
  
  return  {
      "actors": actors,
      "directors": directors,
      "name": get(movieObject, ["name"], ''),
      "sameAs": get(movieObject, ["sameAs"], ''),
      "description": get(movieObject, ["meta-description"], ''),
      "producer": producers,
      "image": get(movieObject, ["photo", "0", "url"], ''),
      "dateCreated": movieCreatedAt?(new Date(movieCreatedAt)).toISOString(): ''
    };
}

export function getSchemaWebsite(website = {}) {
  return Object.assign({},
    getSchemaContext,
    getSchemaType("WebSite"),
    {
      "url": website.url,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${website.url}/${website.searchpath}`,
        "query-input": website.queryinput
      }
    }
  )
}
