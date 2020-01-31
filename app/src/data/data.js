import movies1 from './movies-1.json'
import movies2 from './movies-2.json'
import words from './words.json'

const movies = (items) =>
  movies1
    .map(([title, plot]) => [title, plot.split('. ')[0]])
    .map((item) => [...item, 'movie'])

const combined = [
  ...movies(movies1),
  ...movies(movies2),
  ...words.map((item) => [...item, 'word']),
];

export default combined;
