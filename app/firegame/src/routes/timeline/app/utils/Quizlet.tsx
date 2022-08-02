const _api_url = "https://quizlet.com/webapi/3.1/";
const TERMS_URL = _api_url + "terms?filters[isDeleted]=0&filters[setId]=";
const SET_URL = _api_url + "sets/";
const SEARCH_URL = SET_URL + "search?filters[isDeleted]=0&perPage=9&query=";
const FOLDER_URL =
  _api_url + "folder-sets?filters[folderId]=49189251&filters[isDeleted]=0";

function _fetch(base: string, path: string): Promise<any> {
  var responses = downloaded[base + path];
  if (responses)
    return Promise.resolve().then(() => responses.responses[0].models);
  const anywhere = "https://cors-anywhere.herokuapp.com/";
  return fetch(anywhere + base + path, { headers: { "x-requested-with": "*" } })
    .then((response) => response.json())
    .then((response) => response.responses[0].models)
    .catch(() => window.open(`${anywhere}corsdemo`));
}

const downloaded: { [key: string]: any } = {};

const ex = {
  fetch: _fetch,
  TERMS_URL,
  SEARCH_URL,
  FOLDER_URL,
  SET_URL,
};
export default ex;

downloaded[
  "https://quizlet.com/webapi/3.1/terms?filters[isDeleted]=0&filters[setId]=303629439"
] = {
  responses: [
    {
      models: {
        term: [
          {
            id: 10295700288,
            word: "Mamma Mia (song)",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=TWFtbWEgTWlhIChzb25nKQ&s=YDknakzu",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWFtbWEgTWlhIChzb25nKQ&s=YDknakzu&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TWFtbWEgTWlhIChzb25nKQ&s=YDknakzu",
            definition: "1975",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3NQ&s=pwLfyb7m&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3NQ&s=pwLfyb7m&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3NQ&s=pwLfyb7m&sublanguage=math",
            _imageUrl:
              "https://farm8.staticflickr.com/7405/10187292096_0a18c9e883_m.jpg",
            setId: 303629439,
            rank: 51,
            lastModified: 1591059860,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 16045051,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700341,
            word: "Back in Black (Marvel)",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmFjayBpbiBCbGFjayAoTWFydmVsKQ&s=ytNxNNlQ",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmFjayBpbiBCbGFjayAoTWFydmVsKQ&s=ytNxNNlQ&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmFjayBpbiBCbGFjayAoTWFydmVsKQ&s=ytNxNNlQ",
            definition: "2007",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwNw&s=34jeYHX6&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwNw&s=34jeYHX6&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MjAwNw&s=34jeYHX6&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/nvpI-jyu8wcxgq9YxebQHw_m.jpg",
            setId: 303629439,
            rank: 104,
            lastModified: 1591059448,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 19389851,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700276,
            word: "Get Up (I Feel Like Being a) Sex Machine",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=R2V0IFVwIChJIEZlZWwgTGlrZSBCZWluZyBhKSBTZXggTWFjaGluZQ&s=PcbxOPRB",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R2V0IFVwIChJIEZlZWwgTGlrZSBCZWluZyBhKSBTZXggTWFjaGluZQ&s=PcbxOPRB&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=R2V0IFVwIChJIEZlZWwgTGlrZSBCZWluZyBhKSBTZXggTWFjaGluZQ&s=PcbxOPRB",
            definition: "1970",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3MA&s=bacEFC86&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3MA&s=bacEFC86&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3MA&s=bacEFC86&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/jlqor1K0-li3dupsE8kE1Q_m.jpg",
            setId: 303629439,
            rank: 39,
            lastModified: 1591059229,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 3330242,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700333,
            word: "Hunter x Hunter",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=SHVudGVyIHggSHVudGVy&s=u.pJsPNB",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SHVudGVyIHggSHVudGVy&s=u.pJsPNB&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=SHVudGVyIHggSHVudGVy&s=u.pJsPNB",
            definition: "1998",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5OA&s=ZFr0zvaR&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5OA&s=ZFr0zvaR&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk5OA&s=ZFr0zvaR&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/64uy8D.xBZqCTMbRz4ah1w_m.jpg",
            setId: 303629439,
            rank: 96,
            lastModified: 1591058701,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20576382,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700266,
            word: "Satisfaction (I Can't Get No)",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U2F0aXNmYWN0aW9uIChJIENhbid0IEdldCBObyk&s=2GpL8E-R",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2F0aXNmYWN0aW9uIChJIENhbid0IEdldCBObyk&s=2GpL8E-R&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U2F0aXNmYWN0aW9uIChJIENhbid0IEdldCBObyk&s=2GpL8E-R",
            definition: "1965",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2NQ&s=9PIHq1tm&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2NQ&s=9PIHq1tm&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2NQ&s=9PIHq1tm&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/9jLf-6wBP0KgJbUNbYDq7g_m.png",
            setId: 303629439,
            rank: 29,
            lastModified: 1530221505,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 16936280,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700346,
            word: "Relapse",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=UmVsYXBzZQ&s=Z8iVoRD0",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=UmVsYXBzZQ&s=Z8iVoRD0&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=UmVsYXBzZQ&s=Z8iVoRD0",
            definition: "2009",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwOQ&s=Hzom3Mgo&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwOQ&s=Hzom3Mgo&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MjAwOQ&s=Hzom3Mgo&sublanguage=math",
            _imageUrl:
              "https://farm5.staticflickr.com/4123/4930467466_e91a2ddf9a_m.jpg",
            setId: 303629439,
            rank: 109,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20042564,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700345,
            word: "Bad Romance",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=QmFkIFJvbWFuY2U&s=px5rhPAC",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmFkIFJvbWFuY2U&s=px5rhPAC&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=QmFkIFJvbWFuY2U&s=px5rhPAC",
            definition: "2009",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwOQ&s=Hzom3Mgo&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwOQ&s=Hzom3Mgo&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MjAwOQ&s=Hzom3Mgo&sublanguage=math",
            _imageUrl:
              "https://farm5.staticflickr.com/4150/5015419629_c80174cf23_m.jpg",
            setId: 303629439,
            rank: 108,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 385669,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700344,
            word: "Avatar",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=QXZhdGFy&s=td4qyGge",
            _wordSlowTtsUrl: "/tts/en.mp3?v=14&b=QXZhdGFy&s=td4qyGge&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=QXZhdGFy&s=td4qyGge",
            definition: "2009",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwOQ&s=Hzom3Mgo&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwOQ&s=Hzom3Mgo&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MjAwOQ&s=Hzom3Mgo&sublanguage=math",
            _imageUrl:
              "https://farm3.staticflickr.com/2495/4211101808_959e2a1601_m.jpg",
            setId: 303629439,
            rank: 107,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 19468321,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700343,
            word: "Gran Torino",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=R3JhbiBUb3Jpbm8&s=vofGTQMg",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R3JhbiBUb3Jpbm8&s=vofGTQMg&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=R3JhbiBUb3Jpbm8&s=vofGTQMg",
            definition: "2008",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwOA&s=DpPELXzO&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwOA&s=DpPELXzO&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MjAwOA&s=DpPELXzO&sublanguage=math",
            _imageUrl:
              "https://farm4.staticflickr.com/3626/3363395736_a7b1f1da39_m.jpg",
            setId: 303629439,
            rank: 106,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 4840818,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700342,
            word: "Don't Stop the Music",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RG9uJ3QgU3RvcCB0aGUgTXVzaWM&s=URYifAY9",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RG9uJ3QgU3RvcCB0aGUgTXVzaWM&s=URYifAY9&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RG9uJ3QgU3RvcCB0aGUgTXVzaWM&s=URYifAY9",
            definition: "2007",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwNw&s=34jeYHX6&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwNw&s=34jeYHX6&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MjAwNw&s=34jeYHX6&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/zZfl-a2P2NJtz68PeRlGEw_m.png",
            setId: 303629439,
            rank: 105,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 6500634,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700340,
            word: "Candy Shop",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=Q2FuZHkgU2hvcA&s=xdMUPOhq",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Q2FuZHkgU2hvcA&s=xdMUPOhq&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=Q2FuZHkgU2hvcA&s=xdMUPOhq",
            definition: "2005",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwNQ&s=vdximyX9&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwNQ&s=vdximyX9&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MjAwNQ&s=vdximyX9&sublanguage=math",
            _imageUrl:
              "https://farm3.staticflickr.com/2329/2126724906_647089f201_m.jpg",
            setId: 303629439,
            rank: 103,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 6620990,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700339,
            word: "The Return of the King",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFJldHVybiBvZiB0aGUgS2luZw&s=qoyA-7dy",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFJldHVybiBvZiB0aGUgS2luZw&s=qoyA-7dy&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIFJldHVybiBvZiB0aGUgS2luZw&s=qoyA-7dy",
            definition: "2003",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwMw&s=fd2xj1WZ&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwMw&s=fd2xj1WZ&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MjAwMw&s=fd2xj1WZ&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/jYj30NItYOkCKZgS0z3G3g_m.jpg",
            setId: 303629439,
            rank: 102,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 9000100,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700338,
            word: "One More Time",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=T25lIE1vcmUgVGltZQ&s=0SJwOoLa",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=T25lIE1vcmUgVGltZQ&s=0SJwOoLa&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=T25lIE1vcmUgVGltZQ&s=0SJwOoLa",
            definition: "2001",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwMQ&s=jE4yPB7.&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwMQ&s=jE4yPB7.&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MjAwMQ&s=jE4yPB7.&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/7CnHeJaN22I1pTGHRy7LcA_m.jpg",
            setId: 303629439,
            rank: 101,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 15580187,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700337,
            word: "Origin of Symmetry",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=T3JpZ2luIG9mIFN5bW1ldHJ5&s=IUlB6Pva",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=T3JpZ2luIG9mIFN5bW1ldHJ5&s=IUlB6Pva&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=T3JpZ2luIG9mIFN5bW1ldHJ5&s=IUlB6Pva",
            definition: "2001",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwMQ&s=jE4yPB7.&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwMQ&s=jE4yPB7.&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MjAwMQ&s=jE4yPB7.&sublanguage=math",
            _imageUrl: null,
            setId: 303629439,
            rank: 100,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700336,
            word: "Matrix",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=TWF0cml4&s=gZYyAu6F",
            _wordSlowTtsUrl: "/tts/en.mp3?v=14&b=TWF0cml4&s=gZYyAu6F&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=TWF0cml4&s=gZYyAu6F",
            definition: "1999",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5OQ&s=zSrmbWRP&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5OQ&s=zSrmbWRP&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk5OQ&s=zSrmbWRP&sublanguage=math",
            _imageUrl:
              "https://farm1.staticflickr.com/6/75510807_36eb48baf5_m.jpg",
            setId: 303629439,
            rank: 99,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 17525129,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700335,
            word: "Baby One More Time",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmFieSBPbmUgTW9yZSBUaW1l&s=UvaYX4Zj",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmFieSBPbmUgTW9yZSBUaW1l&s=UvaYX4Zj&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmFieSBPbmUgTW9yZSBUaW1l&s=UvaYX4Zj",
            definition: "1998",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5OA&s=ZFr0zvaR&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5OA&s=ZFr0zvaR&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk5OA&s=ZFr0zvaR&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/LEIoshBgj4YQKsFg0iYXhA_m.jpg",
            setId: 303629439,
            rank: 98,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 15396312,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700334,
            word: "The Big Lebowski",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=VGhlIEJpZyBMZWJvd3NraQ&s=5vUd9zHy",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEJpZyBMZWJvd3NraQ&s=5vUd9zHy&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIEJpZyBMZWJvd3NraQ&s=5vUd9zHy",
            definition: "1998",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5OA&s=ZFr0zvaR&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5OA&s=ZFr0zvaR&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk5OA&s=ZFr0zvaR&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/olWOajPEaJt9u3S.Evah8w_m.jpg",
            setId: 303629439,
            rank: 97,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 2220748,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700332,
            word: "My Heart Will Go On",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TXkgSGVhcnQgV2lsbCBHbyBPbg&s=PrHBampr",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TXkgSGVhcnQgV2lsbCBHbyBPbg&s=PrHBampr&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TXkgSGVhcnQgV2lsbCBHbyBPbg&s=PrHBampr",
            definition: "1997",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5Nw&s=OD.KwUQ5&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5Nw&s=OD.KwUQ5&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk5Nw&s=OD.KwUQ5&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/38ASbYqwaVat9GKhXmjb2g_m.jpg",
            setId: 303629439,
            rank: 95,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20971132,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700331,
            word: "Titanic",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=VGl0YW5pYw&s=xVQqqzey",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGl0YW5pYw&s=xVQqqzey&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=VGl0YW5pYw&s=xVQqqzey",
            definition: "1997",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5Nw&s=OD.KwUQ5&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5Nw&s=OD.KwUQ5&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk5Nw&s=OD.KwUQ5&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/VKte2DpGbBFfjJj2.nfGpA_m.jpg",
            setId: 303629439,
            rank: 94,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 18667487,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700330,
            word: "Wannabe",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=V2FubmFiZQ&s=-56WdiRz",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=V2FubmFiZQ&s=-56WdiRz&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=V2FubmFiZQ&s=-56WdiRz",
            definition: "1996",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5Ng&s=0mIOGmmf&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5Ng&s=0mIOGmmf&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk5Ng&s=0mIOGmmf&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/dqwaQulBeuqK93uBKPuRMg_m.jpg",
            setId: 303629439,
            rank: 93,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 13277536,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700329,
            word: "Seven",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=U2V2ZW4&s=ihBImeU1",
            _wordSlowTtsUrl: "/tts/en.mp3?v=14&b=U2V2ZW4&s=ihBImeU1&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=U2V2ZW4&s=ihBImeU1",
            definition: "1995",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5NQ&s=1fuWjQJA&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5NQ&s=1fuWjQJA&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk5NQ&s=1fuWjQJA&sublanguage=math",
            _imageUrl:
              "https://farm4.staticflickr.com/3075/2512602326_f864a2cce3_m.jpg",
            setId: 303629439,
            rank: 92,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 17947493,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700328,
            word: "California Love",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=Q2FsaWZvcm5pYSBMb3Zl&s=ikbnrrj0",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Q2FsaWZvcm5pYSBMb3Zl&s=ikbnrrj0&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=Q2FsaWZvcm5pYSBMb3Zl&s=ikbnrrj0",
            definition: "1995",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5NQ&s=1fuWjQJA&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5NQ&s=1fuWjQJA&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk5NQ&s=1fuWjQJA&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/nwX5SdAUr9ysA2gTNFdR.Q_m.jpg",
            setId: 303629439,
            rank: 91,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 13315941,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700327,
            word: "Pulp Fiction",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=UHVscCBGaWN0aW9u&s=fCunHaIS",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=UHVscCBGaWN0aW9u&s=fCunHaIS&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=UHVscCBGaWN0aW9u&s=fCunHaIS",
            definition: "1994",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5NA&s=4Z1yNUxJ&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5NA&s=4Z1yNUxJ&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk5NA&s=4Z1yNUxJ&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/yetPFZ7xv38x5R30kOpYaA_m.jpg",
            setId: 303629439,
            rank: 90,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 4765438,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700326,
            word: "The Bodyguard",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=VGhlIEJvZHlndWFyZA&s=MwAr.G4W",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEJvZHlndWFyZA&s=MwAr.G4W&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=VGhlIEJvZHlndWFyZA&s=MwAr.G4W",
            definition: "1992",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5Mg&s=S3V7Lj.Y&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5Mg&s=S3V7Lj.Y&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk5Mg&s=S3V7Lj.Y&sublanguage=math",
            _imageUrl:
              "https://farm8.staticflickr.com/7191/6864296567_9502055cba_m.jpg",
            setId: 303629439,
            rank: 89,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 12591217,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700325,
            word: "Creep",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=Q3JlZXA&s=9KGAE0bJ",
            _wordSlowTtsUrl: "/tts/en.mp3?v=14&b=Q3JlZXA&s=9KGAE0bJ&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=Q3JlZXA&s=9KGAE0bJ",
            definition: "1992",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5Mg&s=S3V7Lj.Y&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5Mg&s=S3V7Lj.Y&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk5Mg&s=S3V7Lj.Y&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/1vWPQ0Sh6nhbGo4WcQn2jw_m.jpg",
            setId: 303629439,
            rank: 88,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 25148949,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700324,
            word: "Nevermind",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=TmV2ZXJtaW5k&s=iC4bQkH9",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TmV2ZXJtaW5k&s=iC4bQkH9&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=TmV2ZXJtaW5k&s=iC4bQkH9",
            definition: "1991",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5MQ&s=jTFLWK5c&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5MQ&s=jTFLWK5c&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk5MQ&s=jTFLWK5c&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/3JZ65B1rfcJmyLBx.7WEDw_m.jpg",
            setId: 303629439,
            rank: 87,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 25059647,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700323,
            word: "Black Album",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=QmxhY2sgQWxidW0&s=-nBSlkHr",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmxhY2sgQWxidW0&s=-nBSlkHr&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=QmxhY2sgQWxidW0&s=-nBSlkHr",
            definition: "1991",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5MQ&s=jTFLWK5c&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5MQ&s=jTFLWK5c&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk5MQ&s=jTFLWK5c&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/W862DnumTQsr3kEOPk8fyA_m.jpg",
            setId: 303629439,
            rank: 86,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 25081471,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700322,
            word: "The Final Countdown",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEZpbmFsIENvdW50ZG93bg&s=k.CEld0.",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEZpbmFsIENvdW50ZG93bg&s=k.CEld0.&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIEZpbmFsIENvdW50ZG93bg&s=k.CEld0.",
            definition: "1986",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Ng&s=h-dBGIuG&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Ng&s=h-dBGIuG&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4Ng&s=h-dBGIuG&sublanguage=math",
            _imageUrl:
              "https://farm1.staticflickr.com/85/250878012_55b96c985c_m.jpg",
            setId: 303629439,
            rank: 85,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 16474429,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700321,
            word: "Money for Nothing",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TW9uZXkgZm9yIE5vdGhpbmc&s=sTnBhAJv",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TW9uZXkgZm9yIE5vdGhpbmc&s=sTnBhAJv&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TW9uZXkgZm9yIE5vdGhpbmc&s=sTnBhAJv",
            definition: "1985",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4NQ&s=keWfvmkE&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4NQ&s=keWfvmkE&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4NQ&s=keWfvmkE&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/dBBV3d9SqGe5n3m1mpxM7w_m.jpg",
            setId: 303629439,
            rank: 84,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 25123862,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700320,
            word: "Back to the Future",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmFjayB0byB0aGUgRnV0dXJl&s=ke5w6S0c",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmFjayB0byB0aGUgRnV0dXJl&s=ke5w6S0c&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmFjayB0byB0aGUgRnV0dXJl&s=ke5w6S0c",
            definition: "1985",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4NQ&s=keWfvmkE&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4NQ&s=keWfvmkE&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4NQ&s=keWfvmkE&sublanguage=math",
            _imageUrl:
              "https://farm3.staticflickr.com/2644/4100030094_5fe0b111d9_m.jpg",
            setId: 303629439,
            rank: 83,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20086890,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700319,
            word: "Ghostbusters",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=R2hvc3RidXN0ZXJz&s=JqXqRl1T",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R2hvc3RidXN0ZXJz&s=JqXqRl1T&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=R2hvc3RidXN0ZXJz&s=JqXqRl1T",
            definition: "1984",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4NA&s=Bn3WJSgE&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4NA&s=Bn3WJSgE&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4NA&s=Bn3WJSgE&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/0EJj7aEReL.Jt0UnavNNIg_m.jpg",
            setId: 303629439,
            rank: 82,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 15396526,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700318,
            word: "Purple Rain",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=UHVycGxlIFJhaW4&s=jUnnyLa.",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=UHVycGxlIFJhaW4&s=jUnnyLa.&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=UHVycGxlIFJhaW4&s=jUnnyLa.",
            definition: "1984",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4NA&s=Bn3WJSgE&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4NA&s=Bn3WJSgE&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4NA&s=Bn3WJSgE&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/uihnhT7mKTBxK93MOC.v5g_m.jpg",
            setId: 303629439,
            rank: 81,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 14035022,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700317,
            word: "Terminator",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=VGVybWluYXRvcg&s=tOceX8rS",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGVybWluYXRvcg&s=tOceX8rS&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=VGVybWluYXRvcg&s=tOceX8rS",
            definition: "1984",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4NA&s=Bn3WJSgE&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4NA&s=Bn3WJSgE&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4NA&s=Bn3WJSgE&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/GbbHyR3n8DbxdgmdnMHZGw_m.jpg",
            setId: 303629439,
            rank: 80,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 7583163,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700316,
            word: "Like a Virgin",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=TGlrZSBhIFZpcmdpbg&s=9outx32O",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TGlrZSBhIFZpcmdpbg&s=9outx32O&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=TGlrZSBhIFZpcmdpbg&s=9outx32O",
            definition: "1984",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4NA&s=Bn3WJSgE&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4NA&s=Bn3WJSgE&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4NA&s=Bn3WJSgE&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/MAt.Y53QxugdT.y79p8-mg_m.jpg",
            setId: 303629439,
            rank: 79,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 1411693,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700315,
            word: "Sunday Bloody Sunday",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U3VuZGF5IEJsb29keSBTdW5kYXk&s=Y9c26fC2",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U3VuZGF5IEJsb29keSBTdW5kYXk&s=Y9c26fC2&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U3VuZGF5IEJsb29keSBTdW5kYXk&s=Y9c26fC2",
            definition: "1983",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Mw&s=De1Dyuwy&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Mw&s=De1Dyuwy&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4Mw&s=De1Dyuwy&sublanguage=math",
            _imageUrl:
              "https://farm1.staticflickr.com/168/410168844_f417440de4_m.jpg",
            setId: 303629439,
            rank: 78,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20749130,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700314,
            word: "Gimme All Your Lovin'",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=R2ltbWUgQWxsIFlvdXIgTG92aW4n&s=-MRrxeJz",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R2ltbWUgQWxsIFlvdXIgTG92aW4n&s=-MRrxeJz&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=R2ltbWUgQWxsIFlvdXIgTG92aW4n&s=-MRrxeJz",
            definition: "1983",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Mw&s=De1Dyuwy&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Mw&s=De1Dyuwy&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4Mw&s=De1Dyuwy&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/xraFs_1lehPsQ29qRj2Szg_m.jpg",
            setId: 303629439,
            rank: 77,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 537082,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700313,
            word: "Scarface",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=U2NhcmZhY2U&s=Y73YnfSv",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2NhcmZhY2U&s=Y73YnfSv&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=U2NhcmZhY2U&s=Y73YnfSv",
            definition: "1983",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Mw&s=De1Dyuwy&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Mw&s=De1Dyuwy&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4Mw&s=De1Dyuwy&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/L4Twm2rYIv.YiE6u2jZOjA_m.jpg",
            setId: 303629439,
            rank: 76,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 4765433,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700312,
            word: "E.T. the Extra-Terrestrial",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RS5ULiB0aGUgRXh0cmEtVGVycmVzdHJpYWw&s=Hvy4hz9x",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RS5ULiB0aGUgRXh0cmEtVGVycmVzdHJpYWw&s=Hvy4hz9x&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RS5ULiB0aGUgRXh0cmEtVGVycmVzdHJpYWw&s=Hvy4hz9x",
            definition: "1982",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Mg&s=XP8Q9b9q&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Mg&s=XP8Q9b9q&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4Mg&s=XP8Q9b9q&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/vkwwDfvVyGwQAlDSJ89B-A_m.jpg",
            setId: 303629439,
            rank: 75,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 4765414,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700311,
            word: "Blade Runner",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=QmxhZGUgUnVubmVy&s=5ITIXss3",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmxhZGUgUnVubmVy&s=5ITIXss3&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=QmxhZGUgUnVubmVy&s=5ITIXss3",
            definition: "1982",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Mg&s=XP8Q9b9q&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Mg&s=XP8Q9b9q&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4Mg&s=XP8Q9b9q&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/QdeGcjhOq.blyl5FmKgsEQ_m.jpg",
            setId: 303629439,
            rank: 74,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 23917198,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700310,
            word: "Conan the Barbarian",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Q29uYW4gdGhlIEJhcmJhcmlhbg&s=wwkcyXUg",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Q29uYW4gdGhlIEJhcmJhcmlhbg&s=wwkcyXUg&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Q29uYW4gdGhlIEJhcmJhcmlhbg&s=wwkcyXUg",
            definition: "1982",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Mg&s=XP8Q9b9q&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Mg&s=XP8Q9b9q&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4Mg&s=XP8Q9b9q&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/THYeCpRQmJvL19x8xGpHGw_m.jpg",
            setId: 303629439,
            rank: 73,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 18955425,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700309,
            word: "Rambo",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=UmFtYm8&s=a3eL6vdR",
            _wordSlowTtsUrl: "/tts/en.mp3?v=14&b=UmFtYm8&s=a3eL6vdR&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=UmFtYm8&s=a3eL6vdR",
            definition: "1982",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Mg&s=XP8Q9b9q&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Mg&s=XP8Q9b9q&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4Mg&s=XP8Q9b9q&sublanguage=math",
            _imageUrl:
              "https://farm6.staticflickr.com/5554/15201054061_6808797286_m.jpg",
            setId: 303629439,
            rank: 72,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 15428578,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700308,
            word: "The Thing",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=VGhlIFRoaW5n&s=T-0gFXXg",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFRoaW5n&s=T-0gFXXg&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=VGhlIFRoaW5n&s=T-0gFXXg",
            definition: "1982",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Mg&s=XP8Q9b9q&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Mg&s=XP8Q9b9q&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4Mg&s=XP8Q9b9q&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/bOT-fFy3rX.EnFY2WO6uhg_m.jpg",
            setId: 303629439,
            rank: 71,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 19749839,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700307,
            word: "Thriller",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=VGhyaWxsZXI&s=daIh.sch",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhyaWxsZXI&s=daIh.sch&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=VGhyaWxsZXI&s=daIh.sch",
            definition: "1982",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Mg&s=XP8Q9b9q&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Mg&s=XP8Q9b9q&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4Mg&s=XP8Q9b9q&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/SEsROxuW6LgPZcyEYdSHgw_m.png",
            setId: 303629439,
            rank: 70,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 8649071,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700306,
            word: "Raiders of the Lost Ark",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=UmFpZGVycyBvZiB0aGUgTG9zdCBBcms&s=eVJuQwF4",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=UmFpZGVycyBvZiB0aGUgTG9zdCBBcms&s=eVJuQwF4&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=UmFpZGVycyBvZiB0aGUgTG9zdCBBcms&s=eVJuQwF4",
            definition: "1981",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4MQ&s=4xOLwoYa&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4MQ&s=4xOLwoYa&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4MQ&s=4xOLwoYa&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/Hllj8Q0A.cQcyVNtX5ufJw_m.jpg",
            setId: 303629439,
            rank: 69,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 6676589,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700305,
            word: "The Blues Brothers",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEJsdWVzIEJyb3RoZXJz&s=DRHnwRN0",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEJsdWVzIEJyb3RoZXJz&s=DRHnwRN0&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIEJsdWVzIEJyb3RoZXJz&s=DRHnwRN0",
            definition: "1980",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4MA&s=V0YTMQfH&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4MA&s=V0YTMQfH&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4MA&s=V0YTMQfH&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/RgxS1HGX8Ozhn0QdDyb80Q_m.jpg",
            setId: 303629439,
            rank: 68,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 47129242,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700304,
            word: "The Shining",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=VGhlIFNoaW5pbmc&s=lzJ2QaJe",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFNoaW5pbmc&s=lzJ2QaJe&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=VGhlIFNoaW5pbmc&s=lzJ2QaJe",
            definition: "1980",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4MA&s=V0YTMQfH&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4MA&s=V0YTMQfH&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4MA&s=V0YTMQfH&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/38hjZRNiVk4axb_P5kJ9ZA_m.jpg",
            setId: 303629439,
            rank: 67,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 19179469,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700303,
            word: "Back in Black",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=QmFjayBpbiBCbGFjaw&s=3mFFvo5m",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmFjayBpbiBCbGFjaw&s=3mFFvo5m&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=QmFjayBpbiBCbGFjaw&s=3mFFvo5m",
            definition: "1980",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4MA&s=V0YTMQfH&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4MA&s=V0YTMQfH&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4MA&s=V0YTMQfH&sublanguage=math",
            _imageUrl:
              "https://farm3.staticflickr.com/2503/3735836032_f89741b4fd_m.jpg",
            setId: 303629439,
            rank: 66,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 19018032,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700302,
            word: "Apocalypse Now",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=QXBvY2FseXBzZSBOb3c&s=iVnL2BS6",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QXBvY2FseXBzZSBOb3c&s=iVnL2BS6&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=QXBvY2FseXBzZSBOb3c&s=iVnL2BS6",
            definition: "1979",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3OQ&s=-hxP-JqY&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3OQ&s=-hxP-JqY&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3OQ&s=-hxP-JqY&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/Yfx-bL3Z1S.pT8BXw6JBtA_m.jpg",
            setId: 303629439,
            rank: 65,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 31861498,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700301,
            word: "Born to Be Alive",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=Qm9ybiB0byBCZSBBbGl2ZQ&s=pLXfaREy",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Qm9ybiB0byBCZSBBbGl2ZQ&s=pLXfaREy&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Qm9ybiB0byBCZSBBbGl2ZQ&s=pLXfaREy",
            definition: "1979",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3OQ&s=-hxP-JqY&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3OQ&s=-hxP-JqY&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3OQ&s=-hxP-JqY&sublanguage=math",
            _imageUrl: null,
            setId: 303629439,
            rank: 64,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700300,
            word: "Alien",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=QWxpZW4&s=O6-pNT-7",
            _wordSlowTtsUrl: "/tts/en.mp3?v=14&b=QWxpZW4&s=O6-pNT-7&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=QWxpZW4&s=O6-pNT-7",
            definition: "1979",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3OQ&s=-hxP-JqY&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3OQ&s=-hxP-JqY&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3OQ&s=-hxP-JqY&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/cr4siavCaSJYOdXkJuJ0pg_m.png",
            setId: 303629439,
            rank: 63,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 26147216,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700299,
            word: "Message in a Bottle",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TWVzc2FnZSBpbiBhIEJvdHRsZQ&s=yHlnx3Rt",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWVzc2FnZSBpbiBhIEJvdHRsZQ&s=yHlnx3Rt&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TWVzc2FnZSBpbiBhIEJvdHRsZQ&s=yHlnx3Rt",
            definition: "1979",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3OQ&s=-hxP-JqY&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3OQ&s=-hxP-JqY&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3OQ&s=-hxP-JqY&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/aS0YX6YhCgvD89EiYrLcsg_m.jpg",
            setId: 303629439,
            rank: 62,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 33074537,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700298,
            word: "Y.M.C.A.",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=WS5NLkMuQS4&s=ZuwsZRT5",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=WS5NLkMuQS4&s=ZuwsZRT5&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=WS5NLkMuQS4&s=ZuwsZRT5",
            definition: "1978",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3OA&s=rDaqkZ1m&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3OA&s=rDaqkZ1m&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3OA&s=rDaqkZ1m&sublanguage=math",
            _imageUrl:
              "https://farm1.staticflickr.com/195/480867085_247c49deac_m.jpg",
            setId: 303629439,
            rank: 61,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 201040,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700297,
            word: "God Save the Queen",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=R29kIFNhdmUgdGhlIFF1ZWVu&s=50x-LjNu",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R29kIFNhdmUgdGhlIFF1ZWVu&s=50x-LjNu&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=R29kIFNhdmUgdGhlIFF1ZWVu&s=50x-LjNu",
            definition: "1977",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Nw&s=HvnbR5.3&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Nw&s=HvnbR5.3&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Nw&s=HvnbR5.3&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/u0FKHow0XZmDAT2QvMxclQ_m.jpg",
            setId: 303629439,
            rank: 60,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 23831432,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700296,
            word: "Star Wars",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=U3RhciBXYXJz&s=A0m4iLES",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U3RhciBXYXJz&s=A0m4iLES&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=U3RhciBXYXJz&s=A0m4iLES",
            definition: "1977",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Nw&s=HvnbR5.3&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Nw&s=HvnbR5.3&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Nw&s=HvnbR5.3&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/loZrCFjgMAVhcu4YyUWr.Q_m.jpg",
            setId: 303629439,
            rank: 59,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 21854010,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700295,
            word: "Saturday Night Fever",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U2F0dXJkYXkgTmlnaHQgRmV2ZXI&s=eBdNo2K8",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2F0dXJkYXkgTmlnaHQgRmV2ZXI&s=eBdNo2K8&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U2F0dXJkYXkgTmlnaHQgRmV2ZXI&s=eBdNo2K8",
            definition: "1977",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Nw&s=HvnbR5.3&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Nw&s=HvnbR5.3&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Nw&s=HvnbR5.3&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/4rCFUdaiYDwwF5gkHIAUqQ_m.jpg",
            setId: 303629439,
            rank: 58,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 4765445,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700294,
            word: "Rocky",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=Um9ja3k&s=QVtRdQG7",
            _wordSlowTtsUrl: "/tts/en.mp3?v=14&b=Um9ja3k&s=QVtRdQG7&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=Um9ja3k&s=QVtRdQG7",
            definition: "1976",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Ng&s=IZ7KW-q6&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Ng&s=IZ7KW-q6&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Ng&s=IZ7KW-q6&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/y-0omQw-qcwPdU-xLq96lQ_m.jpg",
            setId: 303629439,
            rank: 57,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 26944297,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700293,
            word: "Hotel California",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=SG90ZWwgQ2FsaWZvcm5pYQ&s=m5w4tn04",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SG90ZWwgQ2FsaWZvcm5pYQ&s=m5w4tn04&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SG90ZWwgQ2FsaWZvcm5pYQ&s=m5w4tn04",
            definition: "1976",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Ng&s=IZ7KW-q6&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Ng&s=IZ7KW-q6&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Ng&s=IZ7KW-q6&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/NjeDe7ZC64EK63yxQxOjZw_m.jpg",
            setId: 303629439,
            rank: 56,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 25091464,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700292,
            word: "Taxi Driver",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=VGF4aSBEcml2ZXI&s=nIgMQmNO",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGF4aSBEcml2ZXI&s=nIgMQmNO&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=VGF4aSBEcml2ZXI&s=nIgMQmNO",
            definition: "1976",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Ng&s=IZ7KW-q6&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Ng&s=IZ7KW-q6&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Ng&s=IZ7KW-q6&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/qsjC5IYKVOI6OAoMja2c0Q_m.jpg",
            setId: 303629439,
            rank: 55,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 22093730,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700291,
            word: "Jaws",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=SmF3cw&s=CQSwQgjs",
            _wordSlowTtsUrl: "/tts/en.mp3?v=14&b=SmF3cw&s=CQSwQgjs&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=SmF3cw&s=CQSwQgjs",
            definition: "1975",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3NQ&s=pwLfyb7m&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3NQ&s=pwLfyb7m&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3NQ&s=pwLfyb7m&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/jvRmot9Jiz2xlYSiQea9mQ_m.jpg",
            setId: 303629439,
            rank: 54,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 9746210,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700290,
            word: "Bohemian Rhapsody",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Qm9oZW1pYW4gUmhhcHNvZHk&s=Mgy3VPy4",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Qm9oZW1pYW4gUmhhcHNvZHk&s=Mgy3VPy4&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Qm9oZW1pYW4gUmhhcHNvZHk&s=Mgy3VPy4",
            definition: "1975",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3NQ&s=pwLfyb7m&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3NQ&s=pwLfyb7m&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3NQ&s=pwLfyb7m&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/9-vnaA2Xb.zYALtlKkIpiw_m.jpg",
            setId: 303629439,
            rank: 53,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 25630478,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700289,
            word: "Monty Python and the Holy Grail",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TW9udHkgUHl0aG9uIGFuZCB0aGUgSG9seSBHcmFpbA&s=YsASsb0P",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TW9udHkgUHl0aG9uIGFuZCB0aGUgSG9seSBHcmFpbA&s=YsASsb0P&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TW9udHkgUHl0aG9uIGFuZCB0aGUgSG9seSBHcmFpbA&s=YsASsb0P",
            definition: "1975",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3NQ&s=pwLfyb7m&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3NQ&s=pwLfyb7m&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3NQ&s=pwLfyb7m&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/9T-6kANXA2GBtFkBrTQAkw_m.jpg",
            setId: 303629439,
            rank: 52,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 19595957,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700287,
            word: "No Woman, No Cry",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=Tm8gV29tYW4sIE5vIENyeQ&s=UXHDhsmF",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Tm8gV29tYW4sIE5vIENyeQ&s=UXHDhsmF&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Tm8gV29tYW4sIE5vIENyeQ&s=UXHDhsmF",
            definition: "1974",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3NA&s=ToKKRZFD&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3NA&s=ToKKRZFD&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3NA&s=ToKKRZFD&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/W-3Wl2OrQB1keZssA0nwag_m.png",
            setId: 303629439,
            rank: 50,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 25990594,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700286,
            word: "The Texas Chainsaw Massacre",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFRleGFzIENoYWluc2F3IE1hc3NhY3Jl&s=aqgDy-m5",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFRleGFzIENoYWluc2F3IE1hc3NhY3Jl&s=aqgDy-m5&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIFRleGFzIENoYWluc2F3IE1hc3NhY3Jl&s=aqgDy-m5",
            definition: "1974",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3NA&s=ToKKRZFD&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3NA&s=ToKKRZFD&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3NA&s=ToKKRZFD&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/eBdjWB1v97n6-nOXL9A6DQ_m.png",
            setId: 303629439,
            rank: 49,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 28220062,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700285,
            word: "The Dark Side of the Moon",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIERhcmsgU2lkZSBvZiB0aGUgTW9vbg&s=GuCpg5cV",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIERhcmsgU2lkZSBvZiB0aGUgTW9vbg&s=GuCpg5cV&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIERhcmsgU2lkZSBvZiB0aGUgTW9vbg&s=GuCpg5cV",
            definition: "1973",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mw&s=xF71EuGm&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mw&s=xF71EuGm&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Mw&s=xF71EuGm&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i6tSZxL9eL6HWDJTJJkT0w_m.png",
            setId: 303629439,
            rank: 48,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 21169854,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700284,
            word: "Knockin' on Heaven's Door",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=S25vY2tpbicgb24gSGVhdmVuJ3MgRG9vcg&s=Jky.GJ6i",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=S25vY2tpbicgb24gSGVhdmVuJ3MgRG9vcg&s=Jky.GJ6i&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=S25vY2tpbicgb24gSGVhdmVuJ3MgRG9vcg&s=Jky.GJ6i",
            definition: "1973",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mw&s=xF71EuGm&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mw&s=xF71EuGm&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Mw&s=xF71EuGm&sublanguage=math",
            _imageUrl:
              "https://farm3.staticflickr.com/2098/2413931544_ffe896561c_m.jpg",
            setId: 303629439,
            rank: 47,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 4211430,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700283,
            word: "Candle in the Wind",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Q2FuZGxlIGluIHRoZSBXaW5k&s=OEWHQE7h",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Q2FuZGxlIGluIHRoZSBXaW5k&s=OEWHQE7h&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Q2FuZGxlIGluIHRoZSBXaW5k&s=OEWHQE7h",
            definition: "1973",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mw&s=xF71EuGm&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mw&s=xF71EuGm&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Mw&s=xF71EuGm&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/SENDJIqy0wQdXNu74oO8ug_m.jpg",
            setId: 303629439,
            rank: 46,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 15395296,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700282,
            word: "The Exorcist",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=VGhlIEV4b3JjaXN0&s=wHKpMTy1",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEV4b3JjaXN0&s=wHKpMTy1&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=VGhlIEV4b3JjaXN0&s=wHKpMTy1",
            definition: "1973",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mw&s=xF71EuGm&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mw&s=xF71EuGm&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Mw&s=xF71EuGm&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/POV6uxhfVXFmgiB5hAOP.Q_m.jpg",
            setId: 303629439,
            rank: 45,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 901175,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700281,
            word: "The creation of the Ziggy Stardust character",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIGNyZWF0aW9uIG9mIHRoZSBaaWdneSBTdGFyZHVzdCBjaGFyYWN0ZXI&s=kaoX4uXZ",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIGNyZWF0aW9uIG9mIHRoZSBaaWdneSBTdGFyZHVzdCBjaGFyYWN0ZXI&s=kaoX4uXZ&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIGNyZWF0aW9uIG9mIHRoZSBaaWdneSBTdGFyZHVzdCBjaGFyYWN0ZXI&s=kaoX4uXZ",
            definition: "1972",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mg&s=acn97xij&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mg&s=acn97xij&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Mg&s=acn97xij&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/j7l1VHx0h-4T3JuVMkAxqA_m.jpg",
            setId: 303629439,
            rank: 44,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 24195236,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700280,
            word: "The Godfather",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=VGhlIEdvZGZhdGhlcg&s=25lX-ICE",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEdvZGZhdGhlcg&s=25lX-ICE&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=VGhlIEdvZGZhdGhlcg&s=25lX-ICE",
            definition: "1972",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mg&s=acn97xij&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mg&s=acn97xij&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Mg&s=acn97xij&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/7PjTShDKQtSQbp2LNo-C8g_m.jpg",
            setId: 303629439,
            rank: 43,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 14229299,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700279,
            word: "Way of the Dragon",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=V2F5IG9mIHRoZSBEcmFnb24&s=yFg1yBav",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=V2F5IG9mIHRoZSBEcmFnb24&s=yFg1yBav&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=V2F5IG9mIHRoZSBEcmFnb24&s=yFg1yBav",
            definition: "1972",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mg&s=acn97xij&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mg&s=acn97xij&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Mg&s=acn97xij&sublanguage=math",
            _imageUrl:
              "https://farm1.staticflickr.com/27/43855760_fa16727836_m.jpg",
            setId: 303629439,
            rank: 42,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 18413026,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700278,
            word: "Smoke on the Water",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U21va2Ugb24gdGhlIFdhdGVy&s=mmBGDGlv",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U21va2Ugb24gdGhlIFdhdGVy&s=mmBGDGlv&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U21va2Ugb24gdGhlIFdhdGVy&s=mmBGDGlv",
            definition: "1972",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mg&s=acn97xij&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mg&s=acn97xij&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Mg&s=acn97xij&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/sraPt3ZHCbsIbbEYL1-2SQ_m.png",
            setId: 303629439,
            rank: 41,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 1579587,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700277,
            word: "Stairway to Heaven",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U3RhaXJ3YXkgdG8gSGVhdmVu&s=2tvY7wKr",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U3RhaXJ3YXkgdG8gSGVhdmVu&s=2tvY7wKr&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U3RhaXJ3YXkgdG8gSGVhdmVu&s=2tvY7wKr",
            definition: "1971",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3MQ&s=T9IHozH4&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3MQ&s=T9IHozH4&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3MQ&s=T9IHozH4&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/scyJUIw3ntplJajZOFfiaA_m.png",
            setId: 303629439,
            rank: 40,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 26942035,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700275,
            word: "Easy Rider",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=RWFzeSBSaWRlcg&s=.UsxO6t2",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RWFzeSBSaWRlcg&s=.UsxO6t2&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=RWFzeSBSaWRlcg&s=.UsxO6t2",
            definition: "1969",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OQ&s=rig-lDw.&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OQ&s=rig-lDw.&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2OQ&s=rig-lDw.&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/N9BjqmGC95PwFpGRQr9g7g_m.jpg",
            setId: 303629439,
            rank: 38,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 25895058,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700274,
            word: "Born to Be Wild",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=Qm9ybiB0byBCZSBXaWxk&s=oaOrZupr",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Qm9ybiB0byBCZSBXaWxk&s=oaOrZupr&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=Qm9ybiB0byBCZSBXaWxk&s=oaOrZupr",
            definition: "1968",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/fxCpfQCLo.61rXHsAJgTQQ_m.jpg",
            setId: 303629439,
            rank: 37,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 41238790,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700273,
            word: "Planet of the Apes",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=UGxhbmV0IG9mIHRoZSBBcGVz&s=s4DYl-AB",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=UGxhbmV0IG9mIHRoZSBBcGVz&s=s4DYl-AB&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=UGxhbmV0IG9mIHRoZSBBcGVz&s=s4DYl-AB",
            definition: "1968",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/Jsepq45gRkFM6qjpuwtQXA_m.jpg",
            setId: 303629439,
            rank: 36,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 30394896,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700272,
            word: "2001: A Space Odyssey",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=MjAwMTogQSBTcGFjZSBPZHlzc2V5&s=Mp6TRFIR",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MjAwMTogQSBTcGFjZSBPZHlzc2V5&s=Mp6TRFIR&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=MjAwMTogQSBTcGFjZSBPZHlzc2V5&s=Mp6TRFIR",
            definition: "1968",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/hnsQjaLhdbJC2WdSFJipzA_m.png",
            setId: 303629439,
            rank: 35,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 19595850,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700271,
            word: "Mrs. Robinson",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=TXJzLiBSb2JpbnNvbg&s=v9rNxxzf",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TXJzLiBSb2JpbnNvbg&s=v9rNxxzf&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=TXJzLiBSb2JpbnNvbg&s=v9rNxxzf",
            definition: "1968",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/C1SgxQiUHtg4dnFrd.k3qQ_m.jpg",
            setId: 303629439,
            rank: 34,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 25894521,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700270,
            word: "Night of the Living Dead",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TmlnaHQgb2YgdGhlIExpdmluZyBEZWFk&s=fw-IoSIN",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TmlnaHQgb2YgdGhlIExpdmluZyBEZWFk&s=fw-IoSIN&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TmlnaHQgb2YgdGhlIExpdmluZyBEZWFk&s=fw-IoSIN",
            definition: "1968",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/KhrVehc-GDr.JsTzdjElJg_m.jpg",
            setId: 303629439,
            rank: 33,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 32970415,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700269,
            word: "What a Wonderful World",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=V2hhdCBhIFdvbmRlcmZ1bCBXb3JsZA&s=3Cg0TFjf",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=V2hhdCBhIFdvbmRlcmZ1bCBXb3JsZA&s=3Cg0TFjf&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=V2hhdCBhIFdvbmRlcmZ1bCBXb3JsZA&s=3Cg0TFjf",
            definition: "1967",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2Nw&s=pjRxdEan&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2Nw&s=pjRxdEan&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2Nw&s=pjRxdEan&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/MgtpcwmFUhVr1jNNc9Y3Nw_m.jpg",
            setId: 303629439,
            rank: 32,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 18995906,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700268,
            word: "Sgt. Pepper's Lonely Hearts Club Band",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U2d0LiBQZXBwZXIncyBMb25lbHkgSGVhcnRzIENsdWIgQmFuZA&s=OfvNfvsD",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2d0LiBQZXBwZXIncyBMb25lbHkgSGVhcnRzIENsdWIgQmFuZA&s=OfvNfvsD&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U2d0LiBQZXBwZXIncyBMb25lbHkgSGVhcnRzIENsdWIgQmFuZA&s=OfvNfvsD",
            definition: "1967",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2Nw&s=pjRxdEan&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2Nw&s=pjRxdEan&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2Nw&s=pjRxdEan&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/qri7szG7Ss_y2bEGClF2Fw_m.jpg",
            setId: 303629439,
            rank: 31,
            lastModified: 1530150343,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 363432,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700267,
            word: "The Good, The Bad and the Ugly",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEdvb2QsIFRoZSBCYWQgYW5kIHRoZSBVZ2x5&s=f8eo.jPY",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEdvb2QsIFRoZSBCYWQgYW5kIHRoZSBVZ2x5&s=f8eo.jPY&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIEdvb2QsIFRoZSBCYWQgYW5kIHRoZSBVZ2x5&s=f8eo.jPY",
            definition: "1966",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2Ng&s=T4U1nBuz&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2Ng&s=T4U1nBuz&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2Ng&s=T4U1nBuz&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/r2tcXaXkWfQB4YcBfrVSPQ_m.jpg",
            setId: 303629439,
            rank: 30,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 1126693,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700265,
            word: "Goldfinger",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=R29sZGZpbmdlcg&s=VYbdQcO7",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R29sZGZpbmdlcg&s=VYbdQcO7&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=R29sZGZpbmdlcg&s=VYbdQcO7",
            definition: "1964",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2NA&s=yekeLkI9&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2NA&s=yekeLkI9&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2NA&s=yekeLkI9&sublanguage=math",
            _imageUrl:
              "https://farm6.staticflickr.com/5108/5879108387_ef7a2b0bef_m.jpg",
            setId: 303629439,
            rank: 28,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 16988747,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700264,
            word: "The Great Escape",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=VGhlIEdyZWF0IEVzY2FwZQ&s=6CGLbnGp",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEdyZWF0IEVzY2FwZQ&s=6CGLbnGp&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIEdyZWF0IEVzY2FwZQ&s=6CGLbnGp",
            definition: "1963",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2Mw&s=h60DSJxW&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2Mw&s=h60DSJxW&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2Mw&s=h60DSJxW&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/w78v0IP2GYyDxzSSxB5d7Q_m.jpg",
            setId: 303629439,
            rank: 27,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 10512060,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700263,
            word: "Psycho",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=UHN5Y2hv&s=.W7-q8jg",
            _wordSlowTtsUrl: "/tts/en.mp3?v=14&b=UHN5Y2hv&s=.W7-q8jg&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=UHN5Y2hv&s=.W7-q8jg",
            definition: "1960",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2MA&s=XMVUU4oO&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2MA&s=XMVUU4oO&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2MA&s=XMVUU4oO&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/09EOvaqkv-JF8TDk40nEfQ_m.jpg",
            setId: 303629439,
            rank: 26,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 3781328,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700262,
            word: "Ben-Hur",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=QmVuLUh1cg&s=VoPpShZb",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmVuLUh1cg&s=VoPpShZb&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=QmVuLUh1cg&s=VoPpShZb",
            definition: "1959",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1OQ&s=RbHYjTgD&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1OQ&s=RbHYjTgD&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk1OQ&s=RbHYjTgD&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/cFccGUn085usNvlRPJ0Ofg_m.jpg",
            setId: 303629439,
            rank: 25,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 12294253,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700261,
            word: "Great Balls of Fire",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=R3JlYXQgQmFsbHMgb2YgRmlyZQ&s=oWzH9PTu",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R3JlYXQgQmFsbHMgb2YgRmlyZQ&s=oWzH9PTu&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=R3JlYXQgQmFsbHMgb2YgRmlyZQ&s=oWzH9PTu",
            definition: "1957",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1Nw&s=O..J0gVq&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1Nw&s=O..J0gVq&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk1Nw&s=O..J0gVq&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/99MJ5flTBennf9UlXVqJvg_m.jpg",
            setId: 303629439,
            rank: 24,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 15376791,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700260,
            word: "The Bridge on the River Kwai",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEJyaWRnZSBvbiB0aGUgUml2ZXIgS3dhaQ&s=DW1Nnqfz",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEJyaWRnZSBvbiB0aGUgUml2ZXIgS3dhaQ&s=DW1Nnqfz&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIEJyaWRnZSBvbiB0aGUgUml2ZXIgS3dhaQ&s=DW1Nnqfz",
            definition: "1957",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1Nw&s=O..J0gVq&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1Nw&s=O..J0gVq&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk1Nw&s=O..J0gVq&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/oWbBNhewxzmUFkCM5tIwrw_m.jpg",
            setId: 303629439,
            rank: 23,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 25459673,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700259,
            word: "Love Me Tender",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=TG92ZSBNZSBUZW5kZXI&s=AT1ucVQW",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TG92ZSBNZSBUZW5kZXI&s=AT1ucVQW&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=TG92ZSBNZSBUZW5kZXI&s=AT1ucVQW",
            definition: "1956",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1Ng&s=pMOsCc15&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1Ng&s=pMOsCc15&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk1Ng&s=pMOsCc15&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/iBJTr34M3fLf9I9bLBhYfg_m.png",
            setId: 303629439,
            rank: 22,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 16929354,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700258,
            word: "The Night of the Hunter",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIE5pZ2h0IG9mIHRoZSBIdW50ZXI&s=N00wv1GI",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIE5pZ2h0IG9mIHRoZSBIdW50ZXI&s=N00wv1GI&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIE5pZ2h0IG9mIHRoZSBIdW50ZXI&s=N00wv1GI",
            definition: "1955",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1NQ&s=OPFAtZSC&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1NQ&s=OPFAtZSC&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk1NQ&s=OPFAtZSC&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/SaqgCsxPT8umZb78veZecw_m.jpg",
            setId: 303629439,
            rank: 21,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 26861426,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700257,
            word: "Rebel Without a Cause",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=UmViZWwgV2l0aG91dCBhIENhdXNl&s=6yOw4kla",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=UmViZWwgV2l0aG91dCBhIENhdXNl&s=6yOw4kla&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=UmViZWwgV2l0aG91dCBhIENhdXNl&s=6yOw4kla",
            definition: "1955",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1NQ&s=OPFAtZSC&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1NQ&s=OPFAtZSC&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk1NQ&s=OPFAtZSC&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/rQs3tLDHUAPuYsha91xr0w_m.jpg",
            setId: 303629439,
            rank: 20,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 2261306,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700256,
            word: "Godzilla",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=R29kemlsbGE&s=TJY9Tm9f",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R29kemlsbGE&s=TJY9Tm9f&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=R29kemlsbGE&s=TJY9Tm9f",
            definition: "1954",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1NA&s=JL9G-uia&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1NA&s=JL9G-uia&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk1NA&s=JL9G-uia&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/gsFIaiJnFiPeSb896dJ0vg_m.jpg",
            setId: 303629439,
            rank: 19,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 21853900,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700255,
            word: "Seven Samurai",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=U2V2ZW4gU2FtdXJhaQ&s=PXGqIKBw",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2V2ZW4gU2FtdXJhaQ&s=PXGqIKBw&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=U2V2ZW4gU2FtdXJhaQ&s=PXGqIKBw",
            definition: "1954",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1NA&s=JL9G-uia&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1NA&s=JL9G-uia&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk1NA&s=JL9G-uia&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/2LMHw7CPny94BZmz6BHG7Q_m.jpg",
            setId: 303629439,
            rank: 18,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 24268049,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700254,
            word: "Singin' in the Rain",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U2luZ2luJyBpbiB0aGUgUmFpbg&s=tGFl.WD4",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2luZ2luJyBpbiB0aGUgUmFpbg&s=tGFl.WD4&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U2luZ2luJyBpbiB0aGUgUmFpbg&s=tGFl.WD4",
            definition: "1952",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1Mg&s=6jOA2wYH&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1Mg&s=6jOA2wYH&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk1Mg&s=6jOA2wYH&sublanguage=math",
            _imageUrl:
              "https://farm2.staticflickr.com/1118/1033362131_debbd07729_m.jpg",
            setId: 303629439,
            rank: 17,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 547040,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700253,
            word: "The 1st Cannes Film Festival",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIDFzdCBDYW5uZXMgRmlsbSBGZXN0aXZhbA&s=.dOnH8Vx",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIDFzdCBDYW5uZXMgRmlsbSBGZXN0aXZhbA&s=.dOnH8Vx&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIDFzdCBDYW5uZXMgRmlsbSBGZXN0aXZhbA&s=.dOnH8Vx",
            definition: "1946",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk0Ng&s=gAWxO-aU&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk0Ng&s=gAWxO-aU&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk0Ng&s=gAWxO-aU&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/nS6cnYonMPEsoKkqBzjXQg_m.jpg",
            setId: 303629439,
            rank: 16,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 19270901,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700252,
            word: "The Great Dictator",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEdyZWF0IERpY3RhdG9y&s=5GUd2Uy.",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEdyZWF0IERpY3RhdG9y&s=5GUd2Uy.&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIEdyZWF0IERpY3RhdG9y&s=5GUd2Uy.",
            definition: "1940",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk0MA&s=ytUC2TVa&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk0MA&s=ytUC2TVa&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk0MA&s=ytUC2TVa&sublanguage=math",
            _imageUrl:
              "https://farm3.staticflickr.com/2128/1535376771_c2fdb233ec_m.jpg",
            setId: 303629439,
            rank: 15,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20019375,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700251,
            word: "Gone With the Wind",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=R29uZSBXaXRoIHRoZSBXaW5k&s=7prEZqEx",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R29uZSBXaXRoIHRoZSBXaW5k&s=7prEZqEx&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=R29uZSBXaXRoIHRoZSBXaW5k&s=7prEZqEx",
            definition: "1939",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkzOQ&s=WI2qGeJF&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkzOQ&s=WI2qGeJF&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkzOQ&s=WI2qGeJF&sublanguage=math",
            _imageUrl:
              "https://farm5.staticflickr.com/4042/4662769733_4b55762a18_m.jpg",
            setId: 303629439,
            rank: 14,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 347465,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700250,
            word: "Carmina Burana",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=Q2FybWluYSBCdXJhbmE&s=i.0qo3z8",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Q2FybWluYSBCdXJhbmE&s=i.0qo3z8&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=Q2FybWluYSBCdXJhbmE&s=i.0qo3z8",
            definition: "1935",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkzNQ&s=B-PLgHRu&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkzNQ&s=B-PLgHRu&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkzNQ&s=B-PLgHRu&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/KVpXQCESpUjGqsG3c3zLTA_m.jpg",
            setId: 303629439,
            rank: 13,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 3842062,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700249,
            word: "Bolero",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=Qm9sZXJv&s=FrYnDmbU",
            _wordSlowTtsUrl: "/tts/en.mp3?v=14&b=Qm9sZXJv&s=FrYnDmbU&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=Qm9sZXJv&s=FrYnDmbU",
            definition: "1928",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkyOA&s=UviOLTsg&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkyOA&s=UviOLTsg&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkyOA&s=UviOLTsg&sublanguage=math",
            _imageUrl:
              "https://farm1.staticflickr.com/34/72510316_62921240d0_m.jpg",
            setId: 303629439,
            rank: 12,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20370450,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700248,
            word: "Metropolis",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=TWV0cm9wb2xpcw&s=V7MS1zbB",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWV0cm9wb2xpcw&s=V7MS1zbB&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=TWV0cm9wb2xpcw&s=V7MS1zbB",
            definition: "1927",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkyNw&s=kVQu.v2A&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkyNw&s=kVQu.v2A&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkyNw&s=kVQu.v2A&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/RjVkRE2-aQw6zdibUsAP9g_m.jpg",
            setId: 303629439,
            rank: 11,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 26821553,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700247,
            word: "Battleship Potemkin",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmF0dGxlc2hpcCBQb3RlbWtpbg&s=Izgl3eVz",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmF0dGxlc2hpcCBQb3RlbWtpbg&s=Izgl3eVz&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmF0dGxlc2hpcCBQb3RlbWtpbg&s=Izgl3eVz",
            definition: "1925",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkyNQ&s=EIfBgJfF&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkyNQ&s=EIfBgJfF&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkyNQ&s=EIfBgJfF&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/AYOeaJQnB2eKFAiHK8bZ3Q_m.jpg",
            setId: 303629439,
            rank: 10,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 8807528,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700246,
            word: "Nosferatu",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=Tm9zZmVyYXR1&s=hxmqMpnf",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Tm9zZmVyYXR1&s=hxmqMpnf&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=Tm9zZmVyYXR1&s=hxmqMpnf",
            definition: "1922",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkyMg&s=zX.9Kj3h&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkyMg&s=zX.9Kj3h&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkyMg&s=zX.9Kj3h&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/UJgMLq6G_lfsa--KvIWHfg_m.jpg",
            setId: 303629439,
            rank: 9,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 1122571,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700245,
            word: "The birth of Hollywood",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIGJpcnRoIG9mIEhvbGx5d29vZA&s=6bwOOcL0",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIGJpcnRoIG9mIEhvbGx5d29vZA&s=6bwOOcL0&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIGJpcnRoIG9mIEhvbGx5d29vZA&s=6bwOOcL0",
            definition: "1913",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkxMw&s=2ZzOYqlJ&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkxMw&s=2ZzOYqlJ&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkxMw&s=2ZzOYqlJ&sublanguage=math",
            _imageUrl:
              "https://farm7.staticflickr.com/6003/5921490858_ef9e28cb69_m.jpg",
            setId: 303629439,
            rank: 8,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 14385493,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700244,
            word: "the 1st Western (The Great Train Robbery)",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=dGhlIDFzdCBXZXN0ZXJuIChUaGUgR3JlYXQgVHJhaW4gUm9iYmVyeSk&s=1JIuj7P2",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=dGhlIDFzdCBXZXN0ZXJuIChUaGUgR3JlYXQgVHJhaW4gUm9iYmVyeSk&s=1JIuj7P2&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=dGhlIDFzdCBXZXN0ZXJuIChUaGUgR3JlYXQgVHJhaW4gUm9iYmVyeSk&s=1JIuj7P2",
            definition: "1903",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkwMw&s=AZAPA.dy&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkwMw&s=AZAPA.dy&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkwMw&s=AZAPA.dy&sublanguage=math",
            _imageUrl:
              "https://farm4.staticflickr.com/3906/15079680916_33685db46e_m.jpg",
            setId: 303629439,
            rank: 7,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 19711339,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700243,
            word: "Swan Lake",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=U3dhbiBMYWtl&s=JPB3p1sg",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U3dhbiBMYWtl&s=JPB3p1sg&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=U3dhbiBMYWtl&s=JPB3p1sg",
            definition: "1877",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg3Nw&s=iE6YNGok&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg3Nw&s=iE6YNGok&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg3Nw&s=iE6YNGok&sublanguage=math",
            _imageUrl:
              "https://farm4.staticflickr.com/3180/3017148910_d838de3a07_m.jpg",
            setId: 303629439,
            rank: 6,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 2162786,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700242,
            word: "Carmen",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=Q2FybWVu&s=kn1P71ok",
            _wordSlowTtsUrl: "/tts/en.mp3?v=14&b=Q2FybWVu&s=kn1P71ok&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=Q2FybWVu&s=kn1P71ok",
            definition: "1875",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg3NQ&s=g2FKvMys&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg3NQ&s=g2FKvMys&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg3NQ&s=g2FKvMys&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/tx.vzOmHi-6HtoCa8WljEg_m.jpg",
            setId: 303629439,
            rank: 5,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 33110038,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700241,
            word: "The Valkyrie",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=VGhlIFZhbGt5cmll&s=SRHElR9V",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFZhbGt5cmll&s=SRHElR9V&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=VGhlIFZhbGt5cmll&s=SRHElR9V",
            definition: "1870",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg3MA&s=FfWUoSr9&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg3MA&s=FfWUoSr9&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg3MA&s=FfWUoSr9&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/8y9tlJfUFBIYwpAFvoknBA_m.jpg",
            setId: 303629439,
            rank: 4,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 18578968,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700240,
            word: "Fur Elise",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=RnVyIEVsaXNl&s=GLZoGDtV",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RnVyIEVsaXNl&s=GLZoGDtV&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=RnVyIEVsaXNl&s=GLZoGDtV",
            definition: "1810",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTgxMA&s=987cbS9q&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTgxMA&s=987cbS9q&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTgxMA&s=987cbS9q&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/XbFwhVhjG0IjdtUL85p8qw_m.jpg",
            setId: 303629439,
            rank: 3,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 15209357,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700239,
            word: "The Magic Flute",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=VGhlIE1hZ2ljIEZsdXRl&s=UexzkuFk",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIE1hZ2ljIEZsdXRl&s=UexzkuFk&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=VGhlIE1hZ2ljIEZsdXRl&s=UexzkuFk",
            definition: "1791",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTc5MQ&s=6-UyMUyt&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTc5MQ&s=6-UyMUyt&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTc5MQ&s=6-UyMUyt&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/InFKzlDMy8CRQQrVbSXzgw_m.jpg",
            setId: 303629439,
            rank: 2,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 15209356,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700238,
            word: "Goldberg Variations",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=R29sZGJlcmcgVmFyaWF0aW9ucw&s=oLN7dmNN",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R29sZGJlcmcgVmFyaWF0aW9ucw&s=oLN7dmNN&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=R29sZGJlcmcgVmFyaWF0aW9ucw&s=oLN7dmNN",
            definition: "1740",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTc0MA&s=7byjpFWJ&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTc0MA&s=7byjpFWJ&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTc0MA&s=7byjpFWJ&sublanguage=math",
            _imageUrl:
              "https://farm7.staticflickr.com/6120/6213922305_9fe2bf48b8_m.jpg",
            setId: 303629439,
            rank: 1,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 16741668,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295700237,
            word: "First printed music volume",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Rmlyc3QgcHJpbnRlZCBtdXNpYyB2b2x1bWU&s=xCY5zsbD",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Rmlyc3QgcHJpbnRlZCBtdXNpYyB2b2x1bWU&s=xCY5zsbD&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Rmlyc3QgcHJpbnRlZCBtdXNpYyB2b2x1bWU&s=xCY5zsbD",
            definition: "1457",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTQ1Nw&s=ngGatsCk&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTQ1Nw&s=ngGatsCk&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTQ1Nw&s=ngGatsCk&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/2ckfZMDP4tVvfOH8JgjPTw_m.jpg",
            setId: 303629439,
            rank: 0,
            lastModified: 1530149573,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 704769,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
        ],
      },
      paging: {
        total: 110,
        page: 1,
        perPage: 200,
        token: "kxBj7EDk2K.NPyXhU7zH7UC3pY8K",
      },
    },
  ],
};

downloaded[
  "https://quizlet.com/webapi/3.1/folder-sets?filters[folderId]=49189251&filters[isDeleted]=0"
] = {
  responses: [
    {
      models: {
        folderSet: [
          {
            id: 356432825,
            folderId: 49189251,
            setId: 510477676,
            timestamp: 1590981402,
            lastModified: 1590981402,
          },
          {
            id: 356316232,
            folderId: 49189251,
            setId: 510003724,
            timestamp: 1590888047,
            lastModified: 1590888047,
          },
          {
            id: 355823797,
            folderId: 49189251,
            setId: 509798311,
            timestamp: 1590527816,
            lastModified: 1590527816,
          },
          {
            id: 226078708,
            folderId: 49189251,
            setId: 303713083,
            timestamp: 1530216756,
            lastModified: 1530216756,
          },
          {
            id: 226078492,
            folderId: 49189251,
            setId: 303712836,
            timestamp: 1530216573,
            lastModified: 1530216573,
          },
          {
            id: 226003684,
            folderId: 49189251,
            setId: 303629439,
            timestamp: 1530149562,
            lastModified: 1530149562,
          },
          {
            id: 226003429,
            folderId: 49189251,
            setId: 303629084,
            timestamp: 1530149284,
            lastModified: 1530149284,
          },
          {
            id: 226002902,
            folderId: 49189251,
            setId: 303628463,
            timestamp: 1530148707,
            lastModified: 1530148707,
          },
          {
            id: 226002323,
            folderId: 49189251,
            setId: 303628077,
            timestamp: 1530148343,
            lastModified: 1530148343,
          },
          {
            id: 226002123,
            folderId: 49189251,
            setId: 303627863,
            timestamp: 1530148157,
            lastModified: 1530148157,
          },
          {
            id: 210351125,
            folderId: 49189251,
            setId: 284065846,
            timestamp: 1523039716,
            lastModified: 1523039716,
          },
        ],
      },
      paging: {
        total: 11,
        page: 1,
        perPage: 200,
        token: "VyKXzPv2m7.RC9AX5cbRGPuq7b6j",
      },
    },
  ],
};

downloaded["https://quizlet.com/webapi/3.1/sets/510477676"] = {
  responses: [
    {
      models: {
        set: [
          {
            id: 510477676,
            timestamp: 1590981402,
            lastModified: 1590981805,
            publishedTimestamp: 1590981771,
            creatorId: 4302221,
            wordLang: "en",
            defLang: "en",
            title: "US States",
            passwordUse: false,
            passwordEdit: false,
            accessType: 2,
            accessCodePrefix: null,
            description: "",
            numTerms: 50,
            hasImages: true,
            parentId: 0,
            creationSource: 1,
            privacyLockStatus: 0,
            hasDiagrams: false,
            _webUrl: "https://quizlet.com/510477676/us-states-flash-cards/",
            _thumbnailUrl: "https://o.quizlet.com/9rzq9meqMwcTDvgQvbxo2g_m.png",
            price: null,
            mcqCount: 0,
            purchasableType: 0,
          },
        ],
      },
    },
  ],
};

downloaded["https://quizlet.com/webapi/3.1/sets/509798311"] = {
  responses: [
    {
      models: {
        set: [
          {
            id: 509798311,
            timestamp: 1590527815,
            lastModified: 1590528889,
            publishedTimestamp: 1590528869,
            creatorId: 4302221,
            wordLang: "en",
            defLang: "en",
            title: "People by Wikipedia Views (millions)",
            passwordUse: false,
            passwordEdit: false,
            accessType: 2,
            accessCodePrefix: null,
            description: "",
            numTerms: 71,
            hasImages: true,
            parentId: 0,
            creationSource: 1,
            privacyLockStatus: 0,
            hasDiagrams: false,
            _webUrl:
              "https://quizlet.com/509798311/people-by-wikipedia-views-millions-flash-cards/",
            _thumbnailUrl: "https://o.quizlet.com/OYQKnzztBRsWym6q7rHwgQ_m.jpg",
            price: null,
            mcqCount: 0,
            purchasableType: 0,
          },
        ],
      },
    },
  ],
};
downloaded["https://quizlet.com/webapi/3.1/sets/510003724"] = {
  responses: [
    {
      models: {
        set: [
          {
            id: 510003724,
            timestamp: 1590646284,
            lastModified: 1590955891,
            publishedTimestamp: 1590887916,
            creatorId: 4302221,
            wordLang: "en",
            defLang: "en",
            title: "Events in Harry Potter",
            passwordUse: false,
            passwordEdit: false,
            accessType: 2,
            accessCodePrefix: null,
            description: "",
            numTerms: 101,
            hasImages: false,
            parentId: 0,
            creationSource: 1,
            privacyLockStatus: 0,
            hasDiagrams: false,
            _webUrl:
              "https://quizlet.com/510003724/events-in-harry-potter-flash-cards/",
            _thumbnailUrl: null,
            price: null,
            mcqCount: 0,
            purchasableType: 0,
          },
        ],
      },
    },
  ],
};

downloaded["https://quizlet.com/webapi/3.1/sets/303713083"] = {
  responses: [
    {
      models: {
        set: [
          {
            id: 303713083,
            timestamp: 1530216756,
            lastModified: 1530218573,
            publishedTimestamp: 1530216992,
            creatorId: 4302221,
            wordLang: "en",
            defLang: "math",
            title: "Inventions",
            passwordUse: false,
            passwordEdit: false,
            accessType: 2,
            accessCodePrefix: null,
            description: "",
            numTerms: 110,
            hasImages: true,
            parentId: 0,
            creationSource: 1,
            privacyLockStatus: 0,
            hasDiagrams: false,
            _webUrl: "https://quizlet.com/303713083/inventions-flash-cards/",
            _thumbnailUrl: "https://o.quizlet.com/Qt6prvdVGwYZcMsDtQeJFg_m.jpg",
            price: null,
            mcqCount: 0,
            purchasableType: 0,
          },
        ],
      },
    },
  ],
};
downloaded["https://quizlet.com/webapi/3.1/sets/303712836"] = {
  responses: [
    {
      models: {
        set: [
          {
            id: 303712836,
            timestamp: 1530216573,
            lastModified: 1530220236,
            publishedTimestamp: 1530216703,
            creatorId: 4302221,
            wordLang: "en",
            defLang: "math",
            title: "Discoveries",
            passwordUse: false,
            passwordEdit: false,
            accessType: 2,
            accessCodePrefix: null,
            description: "",
            numTerms: 110,
            hasImages: true,
            parentId: 0,
            creationSource: 1,
            privacyLockStatus: 0,
            hasDiagrams: false,
            _webUrl: "https://quizlet.com/303712836/discoveries-flash-cards/",
            _thumbnailUrl: "https://o.quizlet.com/PhTSeh9fhQnmlNMwOK-F7g_m.png",
            price: null,
            mcqCount: 0,
            purchasableType: 0,
          },
        ],
      },
    },
  ],
};
downloaded["https://quizlet.com/webapi/3.1/sets/303629439"] = {
  responses: [
    {
      models: {
        set: [
          {
            id: 303629439,
            timestamp: 1530149562,
            lastModified: 1530221282,
            publishedTimestamp: 1530149602,
            creatorId: 4302221,
            wordLang: "en",
            defLang: "math",
            title: "Music and Cinema",
            passwordUse: false,
            passwordEdit: false,
            accessType: 2,
            accessCodePrefix: null,
            description: "",
            numTerms: 110,
            hasImages: true,
            parentId: 0,
            creationSource: 1,
            privacyLockStatus: 0,
            hasDiagrams: false,
            _webUrl:
              "https://quizlet.com/303629439/music-and-cinema-flash-cards/",
            _thumbnailUrl: "https://o.quizlet.com/64uy8D.xBZqCTMbRz4ah1w_m.jpg",
            price: null,
            mcqCount: 0,
            purchasableType: 0,
          },
        ],
      },
    },
  ],
};
downloaded["https://quizlet.com/webapi/3.1/sets/303629084"] = {
  responses: [
    {
      models: {
        set: [
          {
            id: 303629084,
            timestamp: 1530149284,
            lastModified: 1530557098,
            publishedTimestamp: 1530149301,
            creatorId: 4302221,
            wordLang: "en",
            defLang: "math",
            title: "Historical Events",
            passwordUse: false,
            passwordEdit: false,
            accessType: 2,
            accessCodePrefix: null,
            description: "",
            numTerms: 110,
            hasImages: true,
            parentId: 0,
            creationSource: 1,
            privacyLockStatus: 0,
            hasDiagrams: false,
            _webUrl:
              "https://quizlet.com/303629084/historical-events-flash-cards/",
            _thumbnailUrl:
              "https://farm8.staticflickr.com/7113/7027584837_6750e02f17_m.jpg",
            price: null,
            mcqCount: 0,
            purchasableType: 0,
          },
        ],
      },
    },
  ],
};
downloaded["https://quizlet.com/webapi/3.1/sets/303628463"] = {
  responses: [
    {
      models: {
        set: [
          {
            id: 303628463,
            timestamp: 1530148707,
            lastModified: 1530559890,
            publishedTimestamp: 1530149134,
            creatorId: 4302221,
            wordLang: "en",
            defLang: "math",
            title: "Diversity",
            passwordUse: false,
            passwordEdit: false,
            accessType: 2,
            accessCodePrefix: null,
            description: "",
            numTerms: 110,
            hasImages: true,
            parentId: 0,
            creationSource: 1,
            privacyLockStatus: 0,
            hasDiagrams: false,
            _webUrl: "https://quizlet.com/303628463/diversity-flash-cards/",
            _thumbnailUrl:
              "https://farm4.staticflickr.com/3446/3278639065_15b38c0390_m.jpg",
            price: null,
            mcqCount: 0,
            purchasableType: 0,
          },
        ],
      },
    },
  ],
};
downloaded["https://quizlet.com/webapi/3.1/sets/303628077"] = {
  responses: [
    {
      models: {
        set: [
          {
            id: 303628077,
            timestamp: 1530148343,
            lastModified: 1530558086,
            publishedTimestamp: 1530148559,
            creatorId: 4302221,
            wordLang: "en",
            defLang: "math",
            title: "American History",
            passwordUse: false,
            passwordEdit: false,
            accessType: 2,
            accessCodePrefix: null,
            description: "",
            numTerms: 110,
            hasImages: true,
            parentId: 0,
            creationSource: 1,
            privacyLockStatus: 0,
            hasDiagrams: false,
            _webUrl:
              "https://quizlet.com/303628077/american-history-flash-cards/",
            _thumbnailUrl: "https://o.quizlet.com/atVlCXs-D8Rrt6DrmcVyAg_m.jpg",
            price: null,
            mcqCount: 0,
            purchasableType: 0,
          },
        ],
      },
    },
  ],
};
downloaded["https://quizlet.com/webapi/3.1/sets/303627863"] = {
  responses: [
    {
      models: {
        set: [
          {
            id: 303627863,
            timestamp: 1530148156,
            lastModified: 1530303703,
            publishedTimestamp: 1530148182,
            creatorId: 4302221,
            wordLang: "en",
            defLang: "math",
            title: "Americana",
            passwordUse: false,
            passwordEdit: false,
            accessType: 2,
            accessCodePrefix: null,
            description: "",
            numTerms: 110,
            hasImages: true,
            parentId: 0,
            creationSource: 1,
            privacyLockStatus: 0,
            hasDiagrams: false,
            _webUrl: "https://quizlet.com/303627863/americana-flash-cards/",
            _thumbnailUrl:
              "https://farm2.staticflickr.com/1090/1050733503_fe2291909a_m.jpg",
            price: null,
            mcqCount: 0,
            purchasableType: 0,
          },
        ],
      },
    },
  ],
};
downloaded["https://quizlet.com/webapi/3.1/sets/284065846"] = {
  responses: [
    {
      models: {
        set: [
          {
            id: 284065846,
            timestamp: 1523039716,
            lastModified: 1523042248,
            publishedTimestamp: 1523042248,
            creatorId: 4302221,
            wordLang: "en",
            defLang: "en",
            title: "American Greatest Hits By Year, 1960-2017",
            passwordUse: false,
            passwordEdit: false,
            accessType: 2,
            accessCodePrefix: null,
            description: "",
            numTerms: 58,
            hasImages: true,
            parentId: 0,
            creationSource: 1,
            privacyLockStatus: 0,
            hasDiagrams: false,
            _webUrl:
              "https://quizlet.com/284065846/american-greatest-hits-by-year-1960-2017-flash-cards/",
            _thumbnailUrl: "https://o.quizlet.com/H0pyr7tSWW4HAvjShZIa2w_m.jpg",
            price: null,
            mcqCount: 0,
            purchasableType: 0,
          },
        ],
      },
    },
  ],
};

downloaded[
  "https://quizlet.com/webapi/3.1/terms?filters[isDeleted]=0&filters[setId]=284065846"
] = {
  responses: [
    {
      models: {
        term: [
          {
            id: 9504090790,
            word: "I Wanna Dance With Somebody - Whitney Houston",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SSBXYW5uYSBEYW5jZSBXaXRoIFNvbWVib2R5IC0gV2hpdG5leSBIb3VzdG9u&s=Otflzb.c",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SSBXYW5uYSBEYW5jZSBXaXRoIFNvbWVib2R5IC0gV2hpdG5leSBIb3VzdG9u&s=Otflzb.c&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SSBXYW5uYSBEYW5jZSBXaXRoIFNvbWVib2R5IC0gV2hpdG5leSBIb3VzdG9u&s=Otflzb.c",
            definition: "1987",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk4Nw&s=CK.xFJy3",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk4Nw&s=CK.xFJy3&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk4Nw&s=CK.xFJy3",
            _imageUrl: "https://o.quizlet.com/6HAshDhTcITNY6msg1RuvA_m.jpg",
            setId: 284065846,
            rank: 27,
            lastModified: 1523041502,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606766,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504125494,
            word: "Shape Of You - Ed Sheeran",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U2hhcGUgT2YgWW91IC0gRWQgU2hlZXJhbg&s=kYFT0SlU",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2hhcGUgT2YgWW91IC0gRWQgU2hlZXJhbg&s=kYFT0SlU&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U2hhcGUgT2YgWW91IC0gRWQgU2hlZXJhbg&s=kYFT0SlU",
            definition: "2017",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MjAxNw&s=5TvzkMUL",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MjAxNw&s=5TvzkMUL&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MjAxNw&s=5TvzkMUL",
            _imageUrl: "https://o.quizlet.com/H0pyr7tSWW4HAvjShZIa2w_m.jpg",
            setId: 284065846,
            rank: 57,
            lastModified: 1523040892,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40607203,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504122975,
            word: "Love Yourself - Justin Bieber",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TG92ZSBZb3Vyc2VsZiAtIEp1c3RpbiBCaWViZXI&s=rXzaxxpg",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TG92ZSBZb3Vyc2VsZiAtIEp1c3RpbiBCaWViZXI&s=rXzaxxpg&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TG92ZSBZb3Vyc2VsZiAtIEp1c3RpbiBCaWViZXI&s=rXzaxxpg",
            definition: "2016",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MjAxNg&s=eiZYi1LQ",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MjAxNg&s=eiZYi1LQ&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MjAxNg&s=eiZYi1LQ",
            _imageUrl: "https://o.quizlet.com/g.ZDuCwoX3nOd..qsmvKIg_m.jpg",
            setId: 284065846,
            rank: 56,
            lastModified: 1523040868,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40607193,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504122974,
            word: "Uptown Funk - Mark Ronson Ft. Bruno Mars",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VXB0b3duIEZ1bmsgLSBNYXJrIFJvbnNvbiBGdC4gQnJ1bm8gTWFycw&s=DK-W0OMM",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VXB0b3duIEZ1bmsgLSBNYXJrIFJvbnNvbiBGdC4gQnJ1bm8gTWFycw&s=DK-W0OMM&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VXB0b3duIEZ1bmsgLSBNYXJrIFJvbnNvbiBGdC4gQnJ1bm8gTWFycw&s=DK-W0OMM",
            definition: "2015",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MjAxNQ&s=lBUrk2fU",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MjAxNQ&s=lBUrk2fU&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MjAxNQ&s=lBUrk2fU",
            _imageUrl: "https://o.quizlet.com/WaJ4Jy.ei.ET.elelEln9g_m.jpg",
            setId: 284065846,
            rank: 55,
            lastModified: 1523040856,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40607180,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504121044,
            word: "Happy - Pharell Williams",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFwcHkgLSBQaGFyZWxsIFdpbGxpYW1z&s=Kn3bB4Sz",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFwcHkgLSBQaGFyZWxsIFdpbGxpYW1z&s=Kn3bB4Sz&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFwcHkgLSBQaGFyZWxsIFdpbGxpYW1z&s=Kn3bB4Sz",
            definition: "2014",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MjAxNA&s=PegGRY6Y",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MjAxNA&s=PegGRY6Y&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MjAxNA&s=PegGRY6Y",
            _imageUrl: "https://o.quizlet.com/iLNzKllEM--kN0lpa8lBNg_m.jpg",
            setId: 284065846,
            rank: 54,
            lastModified: 1523040838,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40607167,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504120047,
            word: "Thrift Shop - Macklemore & Ryan Lewis",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhyaWZ0IFNob3AgLSBNYWNrbGVtb3JlICYgUnlhbiBMZXdpcw&s=VdKfx2Ro",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhyaWZ0IFNob3AgLSBNYWNrbGVtb3JlICYgUnlhbiBMZXdpcw&s=VdKfx2Ro&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhyaWZ0IFNob3AgLSBNYWNrbGVtb3JlICYgUnlhbiBMZXdpcw&s=VdKfx2Ro",
            definition: "2013",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MjAxMw&s=sv0j0Rrp",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MjAxMw&s=sv0j0Rrp&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MjAxMw&s=sv0j0Rrp",
            _imageUrl: "https://o.quizlet.com/xKLGmXykjWeKLuBUpicp0Q_m.jpg",
            setId: 284065846,
            rank: 53,
            lastModified: 1523040838,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40607149,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504118812,
            word: "Gangnam Style - PSY",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=R2FuZ25hbSBTdHlsZSAtIFBTWQ&s=KvN09BSM",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R2FuZ25hbSBTdHlsZSAtIFBTWQ&s=KvN09BSM&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=R2FuZ25hbSBTdHlsZSAtIFBTWQ&s=KvN09BSM",
            definition: "2012",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MjAxMg&s=07bG4CsY",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MjAxMg&s=07bG4CsY&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MjAxMg&s=07bG4CsY",
            _imageUrl:
              "https://farm9.staticflickr.com/8345/8251069024_84b678bfea_m.jpg",
            setId: 284065846,
            rank: 52,
            lastModified: 1523040828,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 4534227,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504117098,
            word: "Rolling In The Deep - Adele",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Um9sbGluZyBJbiBUaGUgRGVlcCAtIEFkZWxl&s=RV1wXXnZ",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Um9sbGluZyBJbiBUaGUgRGVlcCAtIEFkZWxl&s=RV1wXXnZ&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Um9sbGluZyBJbiBUaGUgRGVlcCAtIEFkZWxl&s=RV1wXXnZ",
            definition: "2011",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MjAxMQ&s=Auzcfw8v",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MjAxMQ&s=Auzcfw8v&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MjAxMQ&s=Auzcfw8v",
            _imageUrl: "https://o.quizlet.com/dZRGR6S7OPBPx3TJXVWjTQ_m.jpg",
            setId: 284065846,
            rank: 51,
            lastModified: 1523040817,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 25123611,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504116091,
            word: "Tik Tok - Ke$ha",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=VGlrIFRvayAtIEtlJGhh&s=kkuHnuvR",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGlrIFRvayAtIEtlJGhh&s=kkuHnuvR&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=VGlrIFRvayAtIEtlJGhh&s=kkuHnuvR",
            definition: "2010",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MjAxMA&s=Ay9UIl9q",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MjAxMA&s=Ay9UIl9q&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MjAxMA&s=Ay9UIl9q",
            _imageUrl:
              "https://farm6.staticflickr.com/5241/5334048111_7439b5d5bf_m.jpg",
            setId: 284065846,
            rank: 50,
            lastModified: 1523040802,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 802618,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504116090,
            word: "Boom Boom Pow - Black Eyed Peas",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Qm9vbSBCb29tIFBvdyAtIEJsYWNrIEV5ZWQgUGVhcw&s=CiABg89Q",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Qm9vbSBCb29tIFBvdyAtIEJsYWNrIEV5ZWQgUGVhcw&s=CiABg89Q&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Qm9vbSBCb29tIFBvdyAtIEJsYWNrIEV5ZWQgUGVhcw&s=CiABg89Q",
            definition: "2009",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MjAwOQ&s=KbHASqxy",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MjAwOQ&s=KbHASqxy&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MjAwOQ&s=KbHASqxy",
            _imageUrl: "https://o.quizlet.com/g4HkiDrFJRdFaRCZU31VwQ_m.jpg",
            setId: 284065846,
            rank: 49,
            lastModified: 1523040791,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40607090,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504115084,
            word: "Low - Flo Rida",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=TG93IC0gRmxvIFJpZGE&s=r4ADhmmn",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TG93IC0gRmxvIFJpZGE&s=r4ADhmmn&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=TG93IC0gRmxvIFJpZGE&s=r4ADhmmn",
            definition: "2008",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MjAwOA&s=GBRoJvB1",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MjAwOA&s=GBRoJvB1&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MjAwOA&s=GBRoJvB1",
            _imageUrl: "https://o.quizlet.com/4Z3qdExMnWmv4EUAjSndFg_m.jpg",
            setId: 284065846,
            rank: 48,
            lastModified: 1523040780,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40607050,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504114023,
            word: "Irreplaceable - Beyonce",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SXJyZXBsYWNlYWJsZSAtIEJleW9uY2U&s=YF8W7M9w",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SXJyZXBsYWNlYWJsZSAtIEJleW9uY2U&s=YF8W7M9w&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SXJyZXBsYWNlYWJsZSAtIEJleW9uY2U&s=YF8W7M9w",
            definition: "2007",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MjAwNw&s=wUl0hmt9",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MjAwNw&s=wUl0hmt9&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MjAwNw&s=wUl0hmt9",
            _imageUrl: "https://o.quizlet.com/bVUSeVv6r.jntrQfbiFpzA_m.jpg",
            setId: 284065846,
            rank: 47,
            lastModified: 1523040780,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40607041,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504112776,
            word: "Sexyback - Justin Timberlake",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U2V4eWJhY2sgLSBKdXN0aW4gVGltYmVybGFrZQ&s=hB4imoU8",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2V4eWJhY2sgLSBKdXN0aW4gVGltYmVybGFrZQ&s=hB4imoU8&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U2V4eWJhY2sgLSBKdXN0aW4gVGltYmVybGFrZQ&s=hB4imoU8",
            definition: "2006",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MjAwNg&s=IUAf7UtZ",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MjAwNg&s=IUAf7UtZ&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MjAwNg&s=IUAf7UtZ",
            _imageUrl: "https://o.quizlet.com/4deTzifFKQZgewF8WHKCpA_m.jpg",
            setId: 284065846,
            rank: 46,
            lastModified: 1523040755,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40607014,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504112775,
            word: "Gold Digger - Kanye West",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=R29sZCBEaWdnZXIgLSBLYW55ZSBXZXN0&s=Dou6NfbP",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R29sZCBEaWdnZXIgLSBLYW55ZSBXZXN0&s=Dou6NfbP&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=R29sZCBEaWdnZXIgLSBLYW55ZSBXZXN0&s=Dou6NfbP",
            definition: "2005",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MjAwNQ&s=psaoWwCg",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MjAwNQ&s=psaoWwCg&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MjAwNQ&s=psaoWwCg",
            _imageUrl: "https://o.quizlet.com/goMRF38bzBv9H7rgkk7Wng_m.jpg",
            setId: 284065846,
            rank: 45,
            lastModified: 1523040755,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40607004,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504111405,
            word: "Yeah - Usher",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=WWVhaCAtIFVzaGVy&s=ok7xFJ1.",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=WWVhaCAtIFVzaGVy&s=ok7xFJ1.&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=WWVhaCAtIFVzaGVy&s=ok7xFJ1.",
            definition: "2004",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MjAwNA&s=vJV1Ha.9",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MjAwNA&s=vJV1Ha.9&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MjAwNA&s=vJV1Ha.9",
            _imageUrl: "https://o.quizlet.com/oiS0KM5LFYmOH0KcdDTsSg_m.jpg",
            setId: 284065846,
            rank: 44,
            lastModified: 1523040743,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606994,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504110208,
            word: "In Da Club - 50 Cent",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SW4gRGEgQ2x1YiAtIDUwIENlbnQ&s=VlthBes9",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SW4gRGEgQ2x1YiAtIDUwIENlbnQ&s=VlthBes9&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SW4gRGEgQ2x1YiAtIDUwIENlbnQ&s=VlthBes9",
            definition: "2003",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MjAwMw&s=tVU.0pJ-",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MjAwMw&s=tVU.0pJ-&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MjAwMw&s=tVU.0pJ-",
            _imageUrl: "https://o.quizlet.com/1.YTfUCxf5zPWuiKFUt50Q_m.jpg",
            setId: 284065846,
            rank: 43,
            lastModified: 1523040743,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606983,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504110207,
            word: "Lose Yourself - Eminem",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TG9zZSBZb3Vyc2VsZiAtIEVtaW5lbQ&s=o0Jg7gm4",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TG9zZSBZb3Vyc2VsZiAtIEVtaW5lbQ&s=o0Jg7gm4&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TG9zZSBZb3Vyc2VsZiAtIEVtaW5lbQ&s=o0Jg7gm4",
            definition: "2002",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MjAwMg&s=O3-mQdEC",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MjAwMg&s=O3-mQdEC&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MjAwMg&s=O3-mQdEC",
            _imageUrl: "https://o.quizlet.com/E0XjypVOLxgnU38NjZPFnQ_m.png",
            setId: 284065846,
            rank: 42,
            lastModified: 1523040733,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606971,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504108895,
            word: "Fallin' - Alicia Keys",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RmFsbGluJyAtIEFsaWNpYSBLZXlz&s=-c1CQBdG",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RmFsbGluJyAtIEFsaWNpYSBLZXlz&s=-c1CQBdG&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RmFsbGluJyAtIEFsaWNpYSBLZXlz&s=-c1CQBdG",
            definition: "2001",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MjAwMQ&s=zL6nIJWv",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MjAwMQ&s=zL6nIJWv&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MjAwMQ&s=zL6nIJWv",
            _imageUrl: "https://o.quizlet.com/Im.PkOhxydS0dEL9MV4GrA_m.jpg",
            setId: 284065846,
            rank: 41,
            lastModified: 1523040733,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606963,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504107900,
            word: "Smooth - Santana & Rob Thomas",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U21vb3RoIC0gU2FudGFuYSAmIFJvYiBUaG9tYXM&s=7PgDLNyw",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U21vb3RoIC0gU2FudGFuYSAmIFJvYiBUaG9tYXM&s=7PgDLNyw&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U21vb3RoIC0gU2FudGFuYSAmIFJvYiBUaG9tYXM&s=7PgDLNyw",
            definition: "2000",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MjAwMA&s=OtlBMMHG",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MjAwMA&s=OtlBMMHG&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MjAwMA&s=OtlBMMHG",
            _imageUrl: "https://o.quizlet.com/tGoia82Xf-ozlze46frcJA_m.jpg",
            setId: 284065846,
            rank: 40,
            lastModified: 1523040710,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606955,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504107899,
            word: "...Baby One More Time - Britney Spears",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Li4uQmFieSBPbmUgTW9yZSBUaW1lIC0gQnJpdG5leSBTcGVhcnM&s=oi1iSqKj",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Li4uQmFieSBPbmUgTW9yZSBUaW1lIC0gQnJpdG5leSBTcGVhcnM&s=oi1iSqKj&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Li4uQmFieSBPbmUgTW9yZSBUaW1lIC0gQnJpdG5leSBTcGVhcnM&s=oi1iSqKj",
            definition: "1999",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk5OQ&s=-PtyuGzF",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk5OQ&s=-PtyuGzF&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk5OQ&s=-PtyuGzF",
            _imageUrl: "https://o.quizlet.com/0jIOvoa.Zidvw7y98afHVw_m.jpg",
            setId: 284065846,
            rank: 39,
            lastModified: 1523040710,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606941,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504106545,
            word: "My Heart Will Go On - Celine Dion",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TXkgSGVhcnQgV2lsbCBHbyBPbiAtIENlbGluZSBEaW9u&s=kSNZdmd8",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TXkgSGVhcnQgV2lsbCBHbyBPbiAtIENlbGluZSBEaW9u&s=kSNZdmd8&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TXkgSGVhcnQgV2lsbCBHbyBPbiAtIENlbGluZSBEaW9u&s=kSNZdmd8",
            definition: "1998",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk5OA&s=enV6NCDe",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk5OA&s=enV6NCDe&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk5OA&s=enV6NCDe",
            _imageUrl: "https://o.quizlet.com/6cHe4fOho26t..StagkT0Q_m.jpg",
            setId: 284065846,
            rank: 38,
            lastModified: 1523040699,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606932,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504103291,
            word: "I'll Be Missing You - Puff Daddy & The Family",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SSdsbCBCZSBNaXNzaW5nIFlvdSAtIFB1ZmYgRGFkZHkgJiBUaGUgRmFtaWx5&s=9lX9ZoJT",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SSdsbCBCZSBNaXNzaW5nIFlvdSAtIFB1ZmYgRGFkZHkgJiBUaGUgRmFtaWx5&s=9lX9ZoJT&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SSdsbCBCZSBNaXNzaW5nIFlvdSAtIFB1ZmYgRGFkZHkgJiBUaGUgRmFtaWx5&s=9lX9ZoJT",
            definition: "1997",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk5Nw&s=slk73SRd",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk5Nw&s=slk73SRd&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk5Nw&s=slk73SRd",
            _imageUrl: "https://o.quizlet.com/DfxgTTfWDeQo4XY9DdK2Ag_m.jpg",
            setId: 284065846,
            rank: 37,
            lastModified: 1523040665,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606918,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504101406,
            word: "Macarena - Los Del Rio",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TWFjYXJlbmEgLSBMb3MgRGVsIFJpbw&s=kVQARowr",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWFjYXJlbmEgLSBMb3MgRGVsIFJpbw&s=kVQARowr&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TWFjYXJlbmEgLSBMb3MgRGVsIFJpbw&s=kVQARowr",
            definition: "1996",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk5Ng&s=2MR2dbmO",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk5Ng&s=2MR2dbmO&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk5Ng&s=2MR2dbmO",
            _imageUrl: "https://o.quizlet.com/AVU0oyJSzkyYv-1jzcpdKQ_m.jpg",
            setId: 284065846,
            rank: 36,
            lastModified: 1523040646,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606909,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504099286,
            word: "Gangsta's Paradise - Coolio",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=R2FuZ3N0YSdzIFBhcmFkaXNlIC0gQ29vbGlv&s=S2kFviOo",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R2FuZ3N0YSdzIFBhcmFkaXNlIC0gQ29vbGlv&s=S2kFviOo&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=R2FuZ3N0YSdzIFBhcmFkaXNlIC0gQ29vbGlv&s=S2kFviOo",
            definition: "1995",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk5NQ&s=MGJ7uJsC",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk5NQ&s=MGJ7uJsC&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk5NQ&s=MGJ7uJsC",
            _imageUrl: "https://o.quizlet.com/5I8WAyc7LJ3muvyS1H1kcw_m.jpg",
            setId: 284065846,
            rank: 35,
            lastModified: 1523040646,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606897,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504099285,
            word: "I'll Make Love To You - Boyz II Men",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SSdsbCBNYWtlIExvdmUgVG8gWW91IC0gQm95eiBJSSBNZW4&s=Zk9KhPDq",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SSdsbCBNYWtlIExvdmUgVG8gWW91IC0gQm95eiBJSSBNZW4&s=Zk9KhPDq&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SSdsbCBNYWtlIExvdmUgVG8gWW91IC0gQm95eiBJSSBNZW4&s=Zk9KhPDq",
            definition: "1994",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk5NA&s=E3iywlrE",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk5NA&s=E3iywlrE&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk5NA&s=E3iywlrE",
            _imageUrl: "https://o.quizlet.com/8iOwLf6DpcLyFnuaEcE6eQ_m.jpg",
            setId: 284065846,
            rank: 34,
            lastModified: 1523040627,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606887,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504097179,
            word: "I Will Always Love You - Whitney Houston",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SSBXaWxsIEFsd2F5cyBMb3ZlIFlvdSAtIFdoaXRuZXkgSG91c3Rvbg&s=cWVVqYI4",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SSBXaWxsIEFsd2F5cyBMb3ZlIFlvdSAtIFdoaXRuZXkgSG91c3Rvbg&s=cWVVqYI4&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SSBXaWxsIEFsd2F5cyBMb3ZlIFlvdSAtIFdoaXRuZXkgSG91c3Rvbg&s=cWVVqYI4",
            definition: "1993",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk5Mw&s=s49J138E",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk5Mw&s=s49J138E&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk5Mw&s=s49J138E",
            _imageUrl: "https://o.quizlet.com/yn1.IXK2Rd-z85o3kmR3qg_m.jpg",
            setId: 284065846,
            rank: 33,
            lastModified: 1523040616,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606872,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504097178,
            word: "Smells Like Teen Spirit - Nirvana",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U21lbGxzIExpa2UgVGVlbiBTcGlyaXQgLSBOaXJ2YW5h&s=9rKWqi32",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U21lbGxzIExpa2UgVGVlbiBTcGlyaXQgLSBOaXJ2YW5h&s=9rKWqi32&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U21lbGxzIExpa2UgVGVlbiBTcGlyaXQgLSBOaXJ2YW5h&s=9rKWqi32",
            definition: "1992",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk5Mg&s=ocdGapxT",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk5Mg&s=ocdGapxT&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk5Mg&s=ocdGapxT",
            _imageUrl: "https://o.quizlet.com/cYYPvBEmtKKer6crsaFAXw_m.jpg",
            setId: 284065846,
            rank: 32,
            lastModified: 1523040605,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606853,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504095448,
            word: "Black And White - Michael Jackson",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmxhY2sgQW5kIFdoaXRlIC0gTWljaGFlbCBKYWNrc29u&s=iqzmuihb",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmxhY2sgQW5kIFdoaXRlIC0gTWljaGFlbCBKYWNrc29u&s=iqzmuihb&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmxhY2sgQW5kIFdoaXRlIC0gTWljaGFlbCBKYWNrc29u&s=iqzmuihb",
            definition: "1991",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk5MQ&s=aEkzhl5k",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk5MQ&s=aEkzhl5k&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk5MQ&s=aEkzhl5k",
            _imageUrl: "https://o.quizlet.com/hQpXlgagwN-hDC1NZVtc-w_m.jpg",
            setId: 284065846,
            rank: 31,
            lastModified: 1523040589,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606846,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504095447,
            word: "U Can't Touch This - MC Hammer",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VSBDYW4ndCBUb3VjaCBUaGlzIC0gTUMgSGFtbWVy&s=uVRLPb6u",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VSBDYW4ndCBUb3VjaCBUaGlzIC0gTUMgSGFtbWVy&s=uVRLPb6u&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VSBDYW4ndCBUb3VjaCBUaGlzIC0gTUMgSGFtbWVy&s=uVRLPb6u",
            definition: "1990",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk5MA&s=.boEUqWL",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk5MA&s=.boEUqWL&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk5MA&s=.boEUqWL",
            _imageUrl: "https://o.quizlet.com/x6F.T62xMy-yytieSSs5Lw_m.jpg",
            setId: 284065846,
            rank: 30,
            lastModified: 1523040589,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606833,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504093993,
            word: "Like A Prayer - Madonna",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TGlrZSBBIFByYXllciAtIE1hZG9ubmE&s=DacNqcA8",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TGlrZSBBIFByYXllciAtIE1hZG9ubmE&s=DacNqcA8&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TGlrZSBBIFByYXllciAtIE1hZG9ubmE&s=DacNqcA8",
            definition: "1989",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk4OQ&s=whbLZIGh",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk4OQ&s=whbLZIGh&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk4OQ&s=whbLZIGh",
            _imageUrl: "https://o.quizlet.com/XjQ7V-VOBlSNIYBJ.ZrETg_m.jpg",
            setId: 284065846,
            rank: 29,
            lastModified: 1523040575,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606826,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504092759,
            word: "Sweet Child O' Mine - Guns N' Roses",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U3dlZXQgQ2hpbGQgTycgTWluZSAtIEd1bnMgTicgUm9zZXM&s=worl1qmS",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U3dlZXQgQ2hpbGQgTycgTWluZSAtIEd1bnMgTicgUm9zZXM&s=worl1qmS&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U3dlZXQgQ2hpbGQgTycgTWluZSAtIEd1bnMgTicgUm9zZXM&s=worl1qmS",
            definition: "1988",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk4OA&s=fTPOOGN-",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk4OA&s=fTPOOGN-&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk4OA&s=fTPOOGN-",
            _imageUrl: "https://o.quizlet.com/eiyCniw9OOi90f3WxT4drg_m.jpg",
            setId: 284065846,
            rank: 28,
            lastModified: 1523040575,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606780,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504090789,
            word: "Papa Don't Preach - Madonna",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=UGFwYSBEb24ndCBQcmVhY2ggLSBNYWRvbm5h&s=Rm7Q2NWI",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=UGFwYSBEb24ndCBQcmVhY2ggLSBNYWRvbm5h&s=Rm7Q2NWI&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=UGFwYSBEb24ndCBQcmVhY2ggLSBNYWRvbm5h&s=Rm7Q2NWI",
            definition: "1986",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk4Ng&s=ckKekLEh",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk4Ng&s=ckKekLEh&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk4Ng&s=ckKekLEh",
            _imageUrl: "https://o.quizlet.com/SsCu33klglbQU7zlA5l2bw_m.jpg",
            setId: 284065846,
            rank: 26,
            lastModified: 1523040545,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606755,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504089173,
            word: "We Are The World - USA For Africa",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=V2UgQXJlIFRoZSBXb3JsZCAtIFVTQSBGb3IgQWZyaWNh&s=dIw8dIiX",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=V2UgQXJlIFRoZSBXb3JsZCAtIFVTQSBGb3IgQWZyaWNh&s=dIw8dIiX&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=V2UgQXJlIFRoZSBXb3JsZCAtIFVTQSBGb3IgQWZyaWNh&s=dIw8dIiX",
            definition: "1985",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk4NQ&s=xHhTX.kN",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk4NQ&s=xHhTX.kN&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk4NQ&s=xHhTX.kN",
            _imageUrl: "https://o.quizlet.com/lRLC93uGGgJAWt9wLSq81A_m.jpg",
            setId: 284065846,
            rank: 25,
            lastModified: 1523040531,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606749,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504087733,
            word: "Girls Just Wanna Have Fun - Cindy Lauper",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=R2lybHMgSnVzdCBXYW5uYSBIYXZlIEZ1biAtIENpbmR5IExhdXBlcg&s=8pU0bDFv",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R2lybHMgSnVzdCBXYW5uYSBIYXZlIEZ1biAtIENpbmR5IExhdXBlcg&s=8pU0bDFv&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=R2lybHMgSnVzdCBXYW5uYSBIYXZlIEZ1biAtIENpbmR5IExhdXBlcg&s=8pU0bDFv",
            definition: "1984",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk4NA&s=9iRnm3dK",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk4NA&s=9iRnm3dK&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk4NA&s=9iRnm3dK",
            _imageUrl: "https://o.quizlet.com/2D0My3T8XaUzUq6kg-Edzw_m.jpg",
            setId: 284065846,
            rank: 24,
            lastModified: 1523040531,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606735,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504087732,
            word: "Billie Jean - Michael Jackson",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmlsbGllIEplYW4gLSBNaWNoYWVsIEphY2tzb24&s=rAKenyaK",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmlsbGllIEplYW4gLSBNaWNoYWVsIEphY2tzb24&s=rAKenyaK&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmlsbGllIEplYW4gLSBNaWNoYWVsIEphY2tzb24&s=rAKenyaK",
            definition: "1983",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk4Mw&s=Jk68Ode1",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk4Mw&s=Jk68Ode1&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk4Mw&s=Jk68Ode1",
            _imageUrl: "https://o.quizlet.com/fpx9QXYQavFevaT4t83JMQ_m.jpg",
            setId: 284065846,
            rank: 23,
            lastModified: 1523040520,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606725,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504086817,
            word: "Physical - Olivia Newton John",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=UGh5c2ljYWwgLSBPbGl2aWEgTmV3dG9uIEpvaG4&s=qJs.Y-7f",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=UGh5c2ljYWwgLSBPbGl2aWEgTmV3dG9uIEpvaG4&s=qJs.Y-7f&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=UGh5c2ljYWwgLSBPbGl2aWEgTmV3dG9uIEpvaG4&s=qJs.Y-7f",
            definition: "1982",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk4Mg&s=cT96rtD4",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk4Mg&s=cT96rtD4&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk4Mg&s=cT96rtD4",
            _imageUrl: "https://o.quizlet.com/Alpcvi-PBLTPv23UggYXOA_m.jpg",
            setId: 284065846,
            rank: 22,
            lastModified: 1523040509,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606714,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504085457,
            word: "Endless Love - Lionel Richie & Diana Ross",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RW5kbGVzcyBMb3ZlIC0gTGlvbmVsIFJpY2hpZSAmIERpYW5hIFJvc3M&s=JCTxBlvk",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RW5kbGVzcyBMb3ZlIC0gTGlvbmVsIFJpY2hpZSAmIERpYW5hIFJvc3M&s=JCTxBlvk&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RW5kbGVzcyBMb3ZlIC0gTGlvbmVsIFJpY2hpZSAmIERpYW5hIFJvc3M&s=JCTxBlvk",
            definition: "1981",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk4MQ&s=KhInoqhf",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk4MQ&s=KhInoqhf&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk4MQ&s=KhInoqhf",
            _imageUrl: "https://o.quizlet.com/pOtv6Y1xwfd5z..Cad2FiQ_m.jpg",
            setId: 284065846,
            rank: 21,
            lastModified: 1523040509,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606700,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504085456,
            word: "Call Me - Blondie",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Q2FsbCBNZSAtIEJsb25kaWU&s=nxDmQMWD",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Q2FsbCBNZSAtIEJsb25kaWU&s=nxDmQMWD&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Q2FsbCBNZSAtIEJsb25kaWU&s=nxDmQMWD",
            definition: "1980",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk4MA&s=wRyj4U1R",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk4MA&s=wRyj4U1R&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk4MA&s=wRyj4U1R",
            _imageUrl: "https://o.quizlet.com/aRPR07FI-VbA1xyJLZNLXg_m.jpg",
            setId: 284065846,
            rank: 20,
            lastModified: 1523040498,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606690,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504083714,
            word: "I Will Survive - Gloria Gaynor",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SSBXaWxsIFN1cnZpdmUgLSBHbG9yaWEgR2F5bm9y&s=yLB-iD-U",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SSBXaWxsIFN1cnZpdmUgLSBHbG9yaWEgR2F5bm9y&s=yLB-iD-U&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SSBXaWxsIFN1cnZpdmUgLSBHbG9yaWEgR2F5bm9y&s=yLB-iD-U",
            definition: "1979",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk3OQ&s=KGf4p.7M",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk3OQ&s=KGf4p.7M&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk3OQ&s=KGf4p.7M",
            _imageUrl: "https://o.quizlet.com/1.v1STtMTmDCbnx7mQA9gw_m.jpg",
            setId: 284065846,
            rank: 19,
            lastModified: 1523040486,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606666,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504083713,
            word: "Staying Alive - The Bee Gees",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U3RheWluZyBBbGl2ZSAtIFRoZSBCZWUgR2Vlcw&s=JmcH79Br",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U3RheWluZyBBbGl2ZSAtIFRoZSBCZWUgR2Vlcw&s=JmcH79Br&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U3RheWluZyBBbGl2ZSAtIFRoZSBCZWUgR2Vlcw&s=JmcH79Br",
            definition: "1978",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk3OA&s=8Vf9Hg27",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk3OA&s=8Vf9Hg27&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk3OA&s=8Vf9Hg27",
            _imageUrl: "https://o.quizlet.com/AxwhEpvv6gf.Nameof3xIw_m.jpg",
            setId: 284065846,
            rank: 18,
            lastModified: 1523040486,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606660,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504082725,
            word: "Hotel California - The Eagles",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SG90ZWwgQ2FsaWZvcm5pYSAtIFRoZSBFYWdsZXM&s=ZZahCvho",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SG90ZWwgQ2FsaWZvcm5pYSAtIFRoZSBFYWdsZXM&s=ZZahCvho&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SG90ZWwgQ2FsaWZvcm5pYSAtIFRoZSBFYWdsZXM&s=ZZahCvho",
            definition: "1977",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk3Nw&s=arURJzzA",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk3Nw&s=arURJzzA&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk3Nw&s=arURJzzA",
            _imageUrl: "https://o.quizlet.com/NjeDe7ZC64EK63yxQxOjZw_m.jpg",
            setId: 284065846,
            rank: 17,
            lastModified: 1523040474,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 25091464,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504081428,
            word: "Dancing Queen - Abba",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RGFuY2luZyBRdWVlbiAtIEFiYmE&s=yULndxrL",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGFuY2luZyBRdWVlbiAtIEFiYmE&s=yULndxrL&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RGFuY2luZyBRdWVlbiAtIEFiYmE&s=yULndxrL",
            definition: "1976",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk3Ng&s=HsSGDdo1",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk3Ng&s=HsSGDdo1&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk3Ng&s=HsSGDdo1",
            _imageUrl: "https://o.quizlet.com/MO6TJeJNwvLyO8nbgx35Og_m.jpg",
            setId: 284065846,
            rank: 16,
            lastModified: 1523040462,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606640,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504081427,
            word: "That's The Way I Like It - KC & The Sunshine Band",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhhdCdzIFRoZSBXYXkgSSBMaWtlIEl0IC0gS0MgJiBUaGUgU3Vuc2hpbmUgQmFuZA&s=L4oUqc3S",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhhdCdzIFRoZSBXYXkgSSBMaWtlIEl0IC0gS0MgJiBUaGUgU3Vuc2hpbmUgQmFuZA&s=L4oUqc3S&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhhdCdzIFRoZSBXYXkgSSBMaWtlIEl0IC0gS0MgJiBUaGUgU3Vuc2hpbmUgQmFuZA&s=L4oUqc3S",
            definition: "1975",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk3NQ&s=AamaUfyq",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk3NQ&s=AamaUfyq&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk3NQ&s=AamaUfyq",
            _imageUrl: "https://o.quizlet.com/oAP4hRAyoklj8wXT91Z3mQ_m.jpg",
            setId: 284065846,
            rank: 15,
            lastModified: 1523040462,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606616,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504078700,
            word: "The Joker - Steve Miller Band",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEpva2VyIC0gU3RldmUgTWlsbGVyIEJhbmQ&s=IsF3UHMs",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEpva2VyIC0gU3RldmUgTWlsbGVyIEJhbmQ&s=IsF3UHMs&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIEpva2VyIC0gU3RldmUgTWlsbGVyIEJhbmQ&s=IsF3UHMs",
            definition: "1974",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk3NA&s=AGoFCb4o",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk3NA&s=AGoFCb4o&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk3NA&s=AGoFCb4o",
            _imageUrl: "https://o.quizlet.com/XuhKqYgU3R0xcDKllCFOXw_m.jpg",
            setId: 284065846,
            rank: 14,
            lastModified: 1523040451,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606606,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504077427,
            word: "You're So Vain - Carly Simon",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=WW91J3JlIFNvIFZhaW4gLSBDYXJseSBTaW1vbg&s=dO9rFh5o",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=WW91J3JlIFNvIFZhaW4gLSBDYXJseSBTaW1vbg&s=dO9rFh5o&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=WW91J3JlIFNvIFZhaW4gLSBDYXJseSBTaW1vbg&s=dO9rFh5o",
            definition: "1973",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk3Mw&s=p64Sx.8g",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk3Mw&s=p64Sx.8g&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk3Mw&s=p64Sx.8g",
            _imageUrl: "https://o.quizlet.com/vcijM2ho0OoP2DmyMUcruA_m.jpg",
            setId: 284065846,
            rank: 13,
            lastModified: 1523040426,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606590,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504075770,
            word: "American Pie - Don McLean",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QW1lcmljYW4gUGllIC0gRG9uIE1jTGVhbg&s=UanfORSD",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QW1lcmljYW4gUGllIC0gRG9uIE1jTGVhbg&s=UanfORSD&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QW1lcmljYW4gUGllIC0gRG9uIE1jTGVhbg&s=UanfORSD",
            definition: "1972",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk3Mg&s=XK9m5Zuo",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk3Mg&s=XK9m5Zuo&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk3Mg&s=XK9m5Zuo",
            _imageUrl: "https://o.quizlet.com/pCc5j2K75BS08DgFGy6jKA_m.jpg",
            setId: 284065846,
            rank: 12,
            lastModified: 1523040426,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606578,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504075769,
            word: "Imagine - John Lennon",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SW1hZ2luZSAtIEpvaG4gTGVubm9u&s=MRskq54U",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SW1hZ2luZSAtIEpvaG4gTGVubm9u&s=MRskq54U&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SW1hZ2luZSAtIEpvaG4gTGVubm9u&s=MRskq54U",
            definition: "1971",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk3MQ&s=NQayJzRN",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk3MQ&s=NQayJzRN&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk3MQ&s=NQayJzRN",
            _imageUrl: "https://o.quizlet.com/v7NPKr-zuobi1.4A9DYvMw_m.jpg",
            setId: 284065846,
            rank: 11,
            lastModified: 1523040414,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 25149000,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504074469,
            word: "Let It Be - The Beatles",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TGV0IEl0IEJlIC0gVGhlIEJlYXRsZXM&s=zOk7VmRc",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TGV0IEl0IEJlIC0gVGhlIEJlYXRsZXM&s=zOk7VmRc&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TGV0IEl0IEJlIC0gVGhlIEJlYXRsZXM&s=zOk7VmRc",
            definition: "1970",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk3MA&s=hTUXXdZm",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk3MA&s=hTUXXdZm&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk3MA&s=hTUXXdZm",
            _imageUrl: "https://o.quizlet.com/odDHvvf3Qbh.sArmwOoNhg_m.jpg",
            setId: 284065846,
            rank: 10,
            lastModified: 1523040403,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 25091350,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504073215,
            word: "Gimme Shelter - The Rolling Stones",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=R2ltbWUgU2hlbHRlciAtIFRoZSBSb2xsaW5nIFN0b25lcw&s=IX0GC9ck",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R2ltbWUgU2hlbHRlciAtIFRoZSBSb2xsaW5nIFN0b25lcw&s=IX0GC9ck&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=R2ltbWUgU2hlbHRlciAtIFRoZSBSb2xsaW5nIFN0b25lcw&s=IX0GC9ck",
            definition: "1969",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk2OQ&s=4v1-VfNW",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk2OQ&s=4v1-VfNW&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk2OQ&s=4v1-VfNW",
            _imageUrl: "https://o.quizlet.com/AoeTRivKPDyVYAlNkBWbWg_m.jpg",
            setId: 284065846,
            rank: 9,
            lastModified: 1523040403,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606525,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504072095,
            word: "Hey Jude - The Beatles",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGV5IEp1ZGUgLSBUaGUgQmVhdGxlcw&s=0JrjH8mJ",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGV5IEp1ZGUgLSBUaGUgQmVhdGxlcw&s=0JrjH8mJ&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGV5IEp1ZGUgLSBUaGUgQmVhdGxlcw&s=0JrjH8mJ",
            definition: "1968",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk2OA&s=bi7K1UKB",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk2OA&s=bi7K1UKB&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk2OA&s=bi7K1UKB",
            _imageUrl: "https://o.quizlet.com/sJPazf1KihL6DyDUoDbeWQ_m.jpg",
            setId: 284065846,
            rank: 8,
            lastModified: 1523040392,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606487,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504072094,
            word: "All You Need Is Love - The Beatles",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QWxsIFlvdSBOZWVkIElzIExvdmUgLSBUaGUgQmVhdGxlcw&s=lYUN3QpS",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QWxsIFlvdSBOZWVkIElzIExvdmUgLSBUaGUgQmVhdGxlcw&s=lYUN3QpS&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QWxsIFlvdSBOZWVkIElzIExvdmUgLSBUaGUgQmVhdGxlcw&s=lYUN3QpS",
            definition: "1967",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk2Nw&s=gJ8uttL-",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk2Nw&s=gJ8uttL-&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk2Nw&s=gJ8uttL-",
            _imageUrl: "https://o.quizlet.com/mtyH1wNlHY2YJWp-IYns2g_m.jpg",
            setId: 284065846,
            rank: 7,
            lastModified: 1523040382,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606476,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504070663,
            word: "Strangers In The Night - Frank Sinatra",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U3RyYW5nZXJzIEluIFRoZSBOaWdodCAtIEZyYW5rIFNpbmF0cmE&s=5NArv8si",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U3RyYW5nZXJzIEluIFRoZSBOaWdodCAtIEZyYW5rIFNpbmF0cmE&s=5NArv8si&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U3RyYW5nZXJzIEluIFRoZSBOaWdodCAtIEZyYW5rIFNpbmF0cmE&s=5NArv8si",
            definition: "1966",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk2Ng&s=ZJ-7lISJ",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk2Ng&s=ZJ-7lISJ&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk2Ng&s=ZJ-7lISJ",
            _imageUrl: "https://o.quizlet.com/TxwATQOe7uf7BFW9ssqfcg_m.jpg",
            setId: 284065846,
            rank: 6,
            lastModified: 1523040368,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606462,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504069371,
            word: "(I Can't Get No) Satisfaction - The Rolling Stones",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=KEkgQ2FuJ3QgR2V0IE5vKSBTYXRpc2ZhY3Rpb24gLSBUaGUgUm9sbGluZyBTdG9uZXM&s=RIzAXEoC",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=KEkgQ2FuJ3QgR2V0IE5vKSBTYXRpc2ZhY3Rpb24gLSBUaGUgUm9sbGluZyBTdG9uZXM&s=RIzAXEoC&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=KEkgQ2FuJ3QgR2V0IE5vKSBTYXRpc2ZhY3Rpb24gLSBUaGUgUm9sbGluZyBTdG9uZXM&s=RIzAXEoC",
            definition: "1965",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk2NQ&s=QH96Cvrp",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk2NQ&s=QH96Cvrp&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk2NQ&s=QH96Cvrp",
            _imageUrl: "https://o.quizlet.com/QLv5rahaIW-djEQ930IDKg_m.jpg",
            setId: 284065846,
            rank: 5,
            lastModified: 1523040357,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606449,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504064414,
            word: "I Want To Hold Your Hand - The Beatles",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SSBXYW50IFRvIEhvbGQgWW91ciBIYW5kIC0gVGhlIEJlYXRsZXM&s=Y0r.sreY",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SSBXYW50IFRvIEhvbGQgWW91ciBIYW5kIC0gVGhlIEJlYXRsZXM&s=Y0r.sreY&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SSBXYW50IFRvIEhvbGQgWW91ciBIYW5kIC0gVGhlIEJlYXRsZXM&s=Y0r.sreY",
            definition: "1964",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk2NA&s=wBOkT1C9",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk2NA&s=wBOkT1C9&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk2NA&s=wBOkT1C9",
            _imageUrl: "https://o.quizlet.com/LDC4GUdefzHEPyUHO5myfw_m.jpg",
            setId: 284065846,
            rank: 4,
            lastModified: 1523040325,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606125,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504051665,
            word: "She Loves You - The Beatles",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U2hlIExvdmVzIFlvdSAtIFRoZSBCZWF0bGVz&s=zqkJIRZk",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2hlIExvdmVzIFlvdSAtIFRoZSBCZWF0bGVz&s=zqkJIRZk&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U2hlIExvdmVzIFlvdSAtIFRoZSBCZWF0bGVz&s=zqkJIRZk",
            definition: "1963",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk2Mw&s=P1V3tQDb",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk2Mw&s=P1V3tQDb&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk2Mw&s=P1V3tQDb",
            _imageUrl: "https://o.quizlet.com/cx3YmTLJL4NvNutAs5fJKQ_m.jpg",
            setId: 284065846,
            rank: 3,
            lastModified: 1523040261,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606086,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504030733,
            word: "Return To Sender - Elvis Presley",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=UmV0dXJuIFRvIFNlbmRlciAtIEVsdmlzIFByZXNsZXk&s=HtWbOWMz",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=UmV0dXJuIFRvIFNlbmRlciAtIEVsdmlzIFByZXNsZXk&s=HtWbOWMz&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=UmV0dXJuIFRvIFNlbmRlciAtIEVsdmlzIFByZXNsZXk&s=HtWbOWMz",
            definition: "1962",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk2Mg&s=wUCy01GJ",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk2Mg&s=wUCy01GJ&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk2Mg&s=wUCy01GJ",
            _imageUrl: "https://o.quizlet.com/sIJwG9Rk9Wtlz72xQbNJVg_m.jpg",
            setId: 284065846,
            rank: 2,
            lastModified: 1523040156,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40606048,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504011415,
            word: "The Twist - Chubby Checker",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFR3aXN0IC0gQ2h1YmJ5IENoZWNrZXI&s=XO.NE9g5",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFR3aXN0IC0gQ2h1YmJ5IENoZWNrZXI&s=XO.NE9g5&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIFR3aXN0IC0gQ2h1YmJ5IENoZWNrZXI&s=XO.NE9g5",
            definition: "1960",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk2MA&s=rE3KshJd",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk2MA&s=rE3KshJd&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk2MA&s=rE3KshJd",
            _imageUrl: "https://o.quizlet.com/luXNnr0d3zbCj0CcuNTNDQ_m.png",
            setId: 284065846,
            rank: 0,
            lastModified: 1523040156,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 36953729,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 9504019687,
            word: "Stand By Me - Ben E. King",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U3RhbmQgQnkgTWUgLSBCZW4gRS4gS2luZw&s=77nJe3yy",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U3RhbmQgQnkgTWUgLSBCZW4gRS4gS2luZw&s=77nJe3yy&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U3RhbmQgQnkgTWUgLSBCZW4gRS4gS2luZw&s=77nJe3yy",
            definition: "1961",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk2MQ&s=.OrCKOpC",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk2MQ&s=.OrCKOpC&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk2MQ&s=.OrCKOpC",
            _imageUrl: "https://o.quizlet.com/p7ddlQdw7Ja.OQ2knLG-1g_m.jpg",
            setId: 284065846,
            rank: 1,
            lastModified: 1523039965,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 40605947,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
        ],
      },
      paging: {
        total: 58,
        page: 1,
        perPage: 200,
        token: "wCpyXqBRrW.c88U54eXnhxFEU6R5",
      },
    },
  ],
};

downloaded[
  "https://quizlet.com/webapi/3.1/terms?filters[isDeleted]=0&filters[setId]=303628077"
] = {
  responses: [
    {
      models: {
        term: [
          {
            id: 10295646900,
            word: "Slave trade ended",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U2xhdmUgdHJhZGUgZW5kZWQ&s=u.DnUQBz",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2xhdmUgdHJhZGUgZW5kZWQ&s=u.DnUQBz&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U2xhdmUgdHJhZGUgZW5kZWQ&s=u.DnUQBz",
            definition: "1808",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTgwOA&s=drHEzQeJ&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTgwOA&s=drHEzQeJ&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTgwOA&s=drHEzQeJ&sublanguage=math",
            _imageUrl:
              "https://farm4.staticflickr.com/3011/2847524764_82f066da1b_m.jpg",
            setId: 303628077,
            rank: 22,
            lastModified: 1590616502,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 12376284,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646886,
            word: "John Smith Founded the Jamestown Settlement",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Sm9obiBTbWl0aCBGb3VuZGVkIHRoZSBKYW1lc3Rvd24gU2V0dGxlbWVudA&s=nyI5fECK",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Sm9obiBTbWl0aCBGb3VuZGVkIHRoZSBKYW1lc3Rvd24gU2V0dGxlbWVudA&s=nyI5fECK&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Sm9obiBTbWl0aCBGb3VuZGVkIHRoZSBKYW1lc3Rvd24gU2V0dGxlbWVudA&s=nyI5fECK",
            definition: "1607",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTYwNw&s=1ufq5EP0&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTYwNw&s=1ufq5EP0&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTYwNw&s=1ufq5EP0&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/8cBYeXkxwgGTtliY8Xe3Bg_m.jpg",
            setId: 303628077,
            rank: 3,
            lastModified: 1590616375,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 11719698,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646962,
            word: "Operation Desert Storm (beginning)",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=T3BlcmF0aW9uIERlc2VydCBTdG9ybSAoYmVnaW5uaW5nKQ&s=yzbCK6iG",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=T3BlcmF0aW9uIERlc2VydCBTdG9ybSAoYmVnaW5uaW5nKQ&s=yzbCK6iG&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=T3BlcmF0aW9uIERlc2VydCBTdG9ybSAoYmVnaW5uaW5nKQ&s=yzbCK6iG",
            definition: "1991",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5MQ&s=jTFLWK5c&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5MQ&s=jTFLWK5c&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk5MQ&s=jTFLWK5c&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/p7I25Kw7q-6fPLgksITMuw_m.png",
            setId: 303628077,
            rank: 100,
            lastModified: 1530559815,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 18167790,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646949,
            word: "Death of Marilyn Monroe",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgTWFyaWx5biBNb25yb2U&s=Xq9rzxlT",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgTWFyaWx5biBNb25yb2U&s=Xq9rzxlT&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgTWFyaWx5biBNb25yb2U&s=Xq9rzxlT",
            definition: "1962",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2Mg&s=Q3DjTmUc&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2Mg&s=Q3DjTmUc&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2Mg&s=Q3DjTmUc&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/FoT1InIgVbs2p9kveKTeVw_m.jpg",
            setId: 303628077,
            rank: 81,
            lastModified: 1530559689,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 22121024,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646918,
            word: "Established Yellowstone as a National Park",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RXN0YWJsaXNoZWQgWWVsbG93c3RvbmUgYXMgYSBOYXRpb25hbCBQYXJr&s=30jUPIKr",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RXN0YWJsaXNoZWQgWWVsbG93c3RvbmUgYXMgYSBOYXRpb25hbCBQYXJr&s=30jUPIKr&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RXN0YWJsaXNoZWQgWWVsbG93c3RvbmUgYXMgYSBOYXRpb25hbCBQYXJr&s=30jUPIKr",
            definition: "1871",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg3MQ&s=XD.RGuRp&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg3MQ&s=XD.RGuRp&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg3MQ&s=XD.RGuRp&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/cFf108RxCqMmiSgxdUp7eQ_m.jpg",
            setId: 303628077,
            rank: 42,
            lastModified: 1530559459,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20567424,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800407,
            word: "The first transatlantic cable was laid",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIGZpcnN0IHRyYW5zYXRsYW50aWMgY2FibGUgd2FzIGxhaWQ&s=WclSLg2p",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIGZpcnN0IHRyYW5zYXRsYW50aWMgY2FibGUgd2FzIGxhaWQ&s=WclSLg2p&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIGZpcnN0IHRyYW5zYXRsYW50aWMgY2FibGUgd2FzIGxhaWQ&s=WclSLg2p",
            definition: "1858",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg1OA&s=pVlm58.k&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg1OA&s=pVlm58.k&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg1OA&s=pVlm58.k&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/wWUzcm5pSU4wCeQeNamtDg_m.jpg",
            setId: 303628077,
            rank: 31,
            lastModified: 1530559385,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 21711562,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646890,
            word: "The Stamp Act",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=VGhlIFN0YW1wIEFjdA&s=T5kiD.Vy",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFN0YW1wIEFjdA&s=T5kiD.Vy&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=VGhlIFN0YW1wIEFjdA&s=T5kiD.Vy",
            definition: "1765",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTc2NQ&s=H6XHdAWM&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTc2NQ&s=H6XHdAWM&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTc2NQ&s=H6XHdAWM&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/3eG6vX_u7PnrnIkPb2IASQ_m.jpg",
            setId: 303628077,
            rank: 9,
            lastModified: 1530558182,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 7873965,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10296595124,
            word: "The Klondike Gold Rush",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEtsb25kaWtlIEdvbGQgUnVzaA&s=mGbdplDq",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEtsb25kaWtlIEdvbGQgUnVzaA&s=mGbdplDq&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIEtsb25kaWtlIEdvbGQgUnVzaA&s=mGbdplDq",
            definition: "1848",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg0OA&s=fzxZ1EA8&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg0OA&s=fzxZ1EA8&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg0OA&s=fzxZ1EA8&sublanguage=math",
            _imageUrl:
              "https://farm7.staticflickr.com/6141/5954552837_614bd46013_m.jpg",
            setId: 303628077,
            rank: 28,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 4399411,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800427,
            word: "Invasion of Iraq",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=SW52YXNpb24gb2YgSXJhcQ&s=XtJrRaCx",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SW52YXNpb24gb2YgSXJhcQ&s=XtJrRaCx&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SW52YXNpb24gb2YgSXJhcQ&s=XtJrRaCx",
            definition: "2003",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwMw&s=fd2xj1WZ&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwMw&s=fd2xj1WZ&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MjAwMw&s=fd2xj1WZ&sublanguage=math",
            _imageUrl:
              "https://farm2.staticflickr.com/1114/858578052_f5f46c0476_m.jpg",
            setId: 303628077,
            rank: 105,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 14249732,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800426,
            word: "September 11th",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDExdGg&s=GMx72VX-",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDExdGg&s=GMx72VX-&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDExdGg&s=GMx72VX-",
            definition: "2001",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwMQ&s=jE4yPB7.&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwMQ&s=jE4yPB7.&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MjAwMQ&s=jE4yPB7.&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/cRB4vJadO1nUFMENwaJgpQ_m.jpg",
            setId: 303628077,
            rank: 103,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 10083668,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800425,
            word: "Bill Clinton Impeachment Trials",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmlsbCBDbGludG9uIEltcGVhY2htZW50IFRyaWFscw&s=ULR-KZDQ",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmlsbCBDbGludG9uIEltcGVhY2htZW50IFRyaWFscw&s=ULR-KZDQ&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmlsbCBDbGludG9uIEltcGVhY2htZW50IFRyaWFscw&s=ULR-KZDQ",
            definition: "1999",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5OQ&s=zSrmbWRP&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5OQ&s=zSrmbWRP&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk5OQ&s=zSrmbWRP&sublanguage=math",
            _imageUrl:
              "https://farm7.staticflickr.com/6222/6358422543_a44eb43a4f_m.jpg",
            setId: 303628077,
            rank: 102,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 18951169,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800424,
            word: "Crash of the Exxon Valdez",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Q3Jhc2ggb2YgdGhlIEV4eG9uIFZhbGRleg&s=Wlg-eEMk",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Q3Jhc2ggb2YgdGhlIEV4eG9uIFZhbGRleg&s=Wlg-eEMk&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Q3Jhc2ggb2YgdGhlIEV4eG9uIFZhbGRleg&s=Wlg-eEMk",
            definition: "1989",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4OQ&s=15JoLHs9&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4OQ&s=15JoLHs9&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4OQ&s=15JoLHs9&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/hCTLzx6XPmTbJDHM9U4G-A_m.jpg",
            setId: 303628077,
            rank: 99,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20249436,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800423,
            word: "Ronald Reagan first elected President",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Um9uYWxkIFJlYWdhbiBmaXJzdCBlbGVjdGVkIFByZXNpZGVudA&s=gsEnmHR8",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Um9uYWxkIFJlYWdhbiBmaXJzdCBlbGVjdGVkIFByZXNpZGVudA&s=gsEnmHR8&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Um9uYWxkIFJlYWdhbiBmaXJzdCBlbGVjdGVkIFByZXNpZGVudA&s=gsEnmHR8",
            definition: "1980",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4MA&s=V0YTMQfH&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4MA&s=V0YTMQfH&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4MA&s=V0YTMQfH&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/u4VehMXMyntq0NrZhDd4EA_m.jpg",
            setId: 303628077,
            rank: 96,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 9765083,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800422,
            word: "Death of Elvis",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=RGVhdGggb2YgRWx2aXM&s=qlxQNgWe",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgRWx2aXM&s=qlxQNgWe&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=RGVhdGggb2YgRWx2aXM&s=qlxQNgWe",
            definition: "1977",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Nw&s=HvnbR5.3&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Nw&s=HvnbR5.3&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Nw&s=HvnbR5.3&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/iBJTr34M3fLf9I9bLBhYfg_m.png",
            setId: 303628077,
            rank: 94,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 16929354,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800421,
            word: "Nixon's resgination",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Tml4b24ncyByZXNnaW5hdGlvbg&s=76A2gXwY",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Tml4b24ncyByZXNnaW5hdGlvbg&s=76A2gXwY&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Tml4b24ncyByZXNnaW5hdGlvbg&s=76A2gXwY",
            definition: "1974",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3NA&s=ToKKRZFD&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3NA&s=ToKKRZFD&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3NA&s=ToKKRZFD&sublanguage=math",
            _imageUrl:
              "https://farm5.staticflickr.com/4096/4775027305_cbe111320c_m.jpg",
            setId: 303628077,
            rank: 92,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20354378,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800420,
            word: "The Paris Peace Accords",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFBhcmlzIFBlYWNlIEFjY29yZHM&s=d1B96JRP",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFBhcmlzIFBlYWNlIEFjY29yZHM&s=d1B96JRP&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIFBhcmlzIFBlYWNlIEFjY29yZHM&s=d1B96JRP",
            definition: "1973",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mw&s=xF71EuGm&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mw&s=xF71EuGm&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Mw&s=xF71EuGm&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/0dHFX-tKwpZgpS3uChuAvg_m.jpg",
            setId: 303628077,
            rank: 90,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 14123084,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800419,
            word: "Woodstock Festival",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=V29vZHN0b2NrIEZlc3RpdmFs&s=hBjJ87pR",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=V29vZHN0b2NrIEZlc3RpdmFs&s=hBjJ87pR&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=V29vZHN0b2NrIEZlc3RpdmFs&s=hBjJ87pR",
            definition: "1969",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OQ&s=rig-lDw.&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OQ&s=rig-lDw.&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2OQ&s=rig-lDw.&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/GUjmd5I11E12n5e5Czz.qg_m.jpg",
            setId: 303628077,
            rank: 86,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 21171581,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800418,
            word: "Cuban Missile Crisis",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Q3ViYW4gTWlzc2lsZSBDcmlzaXM&s=kJmXkb0-",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Q3ViYW4gTWlzc2lsZSBDcmlzaXM&s=kJmXkb0-&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Q3ViYW4gTWlzc2lsZSBDcmlzaXM&s=kJmXkb0-",
            definition: "1962",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2Mg&s=Q3DjTmUc&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2Mg&s=Q3DjTmUc&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2Mg&s=Q3DjTmUc&sublanguage=math",
            _imageUrl:
              "https://farm4.staticflickr.com/3492/3764865407_8ea72123eb_m.jpg",
            setId: 303628077,
            rank: 80,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20577257,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800417,
            word: "Beginning of the Vietnam War",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmVnaW5uaW5nIG9mIHRoZSBWaWV0bmFtIFdhcg&s=X7cM95DB",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmVnaW5uaW5nIG9mIHRoZSBWaWV0bmFtIFdhcg&s=X7cM95DB&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmVnaW5uaW5nIG9mIHRoZSBWaWV0bmFtIFdhcg&s=X7cM95DB",
            definition: "1961",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2MQ&s=KW1vz6Pk&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2MQ&s=KW1vz6Pk&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2MQ&s=KW1vz6Pk&sublanguage=math",
            _imageUrl:
              "https://farm9.staticflickr.com/8005/7367367692_32619216bc_m.jpg",
            setId: 303628077,
            rank: 79,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 13314599,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800416,
            word: "Mount Rushmore",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=TW91bnQgUnVzaG1vcmU&s=vWFX1FSB",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TW91bnQgUnVzaG1vcmU&s=vWFX1FSB&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=TW91bnQgUnVzaG1vcmU&s=vWFX1FSB",
            definition: "1941",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk0MQ&s=TSmWl3Da&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk0MQ&s=TSmWl3Da&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk0MQ&s=TSmWl3Da&sublanguage=math",
            _imageUrl:
              "https://farm1.staticflickr.com/24/52622356_83136610e1_m.jpg",
            setId: 303628077,
            rank: 67,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20252374,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800415,
            word: "The Museum of Modern Art opened in NYC",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIE11c2V1bSBvZiBNb2Rlcm4gQXJ0IG9wZW5lZCBpbiBOWUM&s=byD8OZLN",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIE11c2V1bSBvZiBNb2Rlcm4gQXJ0IG9wZW5lZCBpbiBOWUM&s=byD8OZLN&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIE11c2V1bSBvZiBNb2Rlcm4gQXJ0IG9wZW5lZCBpbiBOWUM&s=byD8OZLN",
            definition: "1929",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkyOQ&s=3KBuSn0l&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkyOQ&s=3KBuSn0l&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkyOQ&s=3KBuSn0l&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/-MuzXBZU4dDQP7id3QwHoA_m.jpg",
            setId: 303628077,
            rank: 61,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 18430769,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800414,
            word: "First Miss America Pageant",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Rmlyc3QgTWlzcyBBbWVyaWNhIFBhZ2VhbnQ&s=sx34YMjO",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Rmlyc3QgTWlzcyBBbWVyaWNhIFBhZ2VhbnQ&s=sx34YMjO&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Rmlyc3QgTWlzcyBBbWVyaWNhIFBhZ2VhbnQ&s=sx34YMjO",
            definition: "1921",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkyMQ&s=mNVzcWBn&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkyMQ&s=mNVzcWBn&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkyMQ&s=mNVzcWBn&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/Ctop1WwVsgzQHj.qIcHoYg_m.png",
            setId: 303628077,
            rank: 59,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 1651748,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800411,
            word: "San Francisco earthquake (magnitude 8.2)",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U2FuIEZyYW5jaXNjbyBlYXJ0aHF1YWtlIChtYWduaXR1ZGUgOC4yKQ&s=JfqBIZYx",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2FuIEZyYW5jaXNjbyBlYXJ0aHF1YWtlIChtYWduaXR1ZGUgOC4yKQ&s=JfqBIZYx&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U2FuIEZyYW5jaXNjbyBlYXJ0aHF1YWtlIChtYWduaXR1ZGUgOC4yKQ&s=JfqBIZYx",
            definition: "1906",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkwNg&s=D4OfoBYg&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkwNg&s=D4OfoBYg&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkwNg&s=D4OfoBYg&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i9fN-r92Ld19Zviv1jsp5A_m.png",
            setId: 303628077,
            rank: 52,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 11170117,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800410,
            word: "Theodore Roosevelt elected President",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlb2RvcmUgUm9vc2V2ZWx0IGVsZWN0ZWQgUHJlc2lkZW50&s=izBHq-Mg",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlb2RvcmUgUm9vc2V2ZWx0IGVsZWN0ZWQgUHJlc2lkZW50&s=izBHq-Mg&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlb2RvcmUgUm9vc2V2ZWx0IGVsZWN0ZWQgUHJlc2lkZW50&s=izBHq-Mg",
            definition: "1900",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkwMA&s=9ytEu2-a&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkwMA&s=9ytEu2-a&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkwMA&s=9ytEu2-a&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/NUPaqleXsEKlbyHYw3vhXw_m.jpg",
            setId: 303628077,
            rank: 50,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 21171917,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800409,
            word: "Inauguration of Statue of Liberty",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SW5hdWd1cmF0aW9uIG9mIFN0YXR1ZSBvZiBMaWJlcnR5&s=fiGeQK3Y",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SW5hdWd1cmF0aW9uIG9mIFN0YXR1ZSBvZiBMaWJlcnR5&s=fiGeQK3Y&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SW5hdWd1cmF0aW9uIG9mIFN0YXR1ZSBvZiBMaWJlcnR5&s=fiGeQK3Y",
            definition: "1886",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg4Ng&s=o-5hYXpc&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg4Ng&s=o-5hYXpc&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg4Ng&s=o-5hYXpc&sublanguage=math",
            _imageUrl:
              "https://farm4.staticflickr.com/3199/2934626028_624bcfa3ec_m.jpg",
            setId: 303628077,
            rank: 49,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20403729,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800408,
            word: "Purchase of Alaska",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=UHVyY2hhc2Ugb2YgQWxhc2th&s=urIWFEBZ",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=UHVyY2hhc2Ugb2YgQWxhc2th&s=urIWFEBZ&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=UHVyY2hhc2Ugb2YgQWxhc2th&s=urIWFEBZ",
            definition: "1867",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2Nw&s=BJbahFKn&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2Nw&s=BJbahFKn&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg2Nw&s=BJbahFKn&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/Mf2yQve21Ir736OEx5qDZQ_m.jpg",
            setId: 303628077,
            rank: 38,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20574192,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646968,
            word: "Deepwater Horizon oil spill",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RGVlcHdhdGVyIEhvcml6b24gb2lsIHNwaWxs&s=dQ8X3G6H",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVlcHdhdGVyIEhvcml6b24gb2lsIHNwaWxs&s=dQ8X3G6H&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RGVlcHdhdGVyIEhvcml6b24gb2lsIHNwaWxs&s=dQ8X3G6H",
            definition: "2010",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MjAxMA&s=za-CL3dC&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MjAxMA&s=za-CL3dC&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MjAxMA&s=za-CL3dC&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/atVlCXs-D8Rrt6DrmcVyAg_m.jpg",
            setId: 303628077,
            rank: 109,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 21844496,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646967,
            word: "Barack Obama first elected President",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmFyYWNrIE9iYW1hIGZpcnN0IGVsZWN0ZWQgUHJlc2lkZW50&s=q6M9Bxmr",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmFyYWNrIE9iYW1hIGZpcnN0IGVsZWN0ZWQgUHJlc2lkZW50&s=q6M9Bxmr&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmFyYWNrIE9iYW1hIGZpcnN0IGVsZWN0ZWQgUHJlc2lkZW50&s=q6M9Bxmr",
            definition: "2008",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwOA&s=DpPELXzO&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwOA&s=DpPELXzO&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MjAwOA&s=DpPELXzO&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/-WPM2M3BGz3suBi3NOApdg_m.jpg",
            setId: 303628077,
            rank: 108,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20409871,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646966,
            word: "Global Financial Crisis",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=R2xvYmFsIEZpbmFuY2lhbCBDcmlzaXM&s=8O4mF6ns",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R2xvYmFsIEZpbmFuY2lhbCBDcmlzaXM&s=8O4mF6ns&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=R2xvYmFsIEZpbmFuY2lhbCBDcmlzaXM&s=8O4mF6ns",
            definition: "2008",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwOA&s=DpPELXzO&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwOA&s=DpPELXzO&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MjAwOA&s=DpPELXzO&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/5QzFJBLj04QE9-21R0vAJg_m.jpg",
            setId: 303628077,
            rank: 107,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 5102849,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646965,
            word: "Hurricane Katrina",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SHVycmljYW5lIEthdHJpbmE&s=6Mk8OSBe",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SHVycmljYW5lIEthdHJpbmE&s=6Mk8OSBe&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SHVycmljYW5lIEthdHJpbmE&s=6Mk8OSBe",
            definition: "2005",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwNQ&s=vdximyX9&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwNQ&s=vdximyX9&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MjAwNQ&s=vdximyX9&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/vzKDYYCPHyBfX-4S94sKEA_m.jpg",
            setId: 303628077,
            rank: 106,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 13049923,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646964,
            word: "Beginning of war in Afghanistan",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmVnaW5uaW5nIG9mIHdhciBpbiBBZmdoYW5pc3Rhbg&s=xPiaLaNB",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmVnaW5uaW5nIG9mIHdhciBpbiBBZmdoYW5pc3Rhbg&s=xPiaLaNB&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmVnaW5uaW5nIG9mIHdhciBpbiBBZmdoYW5pc3Rhbg&s=xPiaLaNB",
            definition: "2001",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwMQ&s=jE4yPB7.&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MjAwMQ&s=jE4yPB7.&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MjAwMQ&s=jE4yPB7.&sublanguage=math",
            _imageUrl:
              "https://farm4.staticflickr.com/3153/3071528506_ab74984f8e_m.jpg",
            setId: 303628077,
            rank: 104,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20442610,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646963,
            word: "Bill Clinton first elected President",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmlsbCBDbGludG9uIGZpcnN0IGVsZWN0ZWQgUHJlc2lkZW50&s=z5gO5eRl",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmlsbCBDbGludG9uIGZpcnN0IGVsZWN0ZWQgUHJlc2lkZW50&s=z5gO5eRl&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmlsbCBDbGludG9uIGZpcnN0IGVsZWN0ZWQgUHJlc2lkZW50&s=z5gO5eRl",
            definition: "1992",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5Mg&s=S3V7Lj.Y&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk5Mg&s=S3V7Lj.Y&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk5Mg&s=S3V7Lj.Y&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/7su_BoxdEjji1szANnAXLQ_m.jpg",
            setId: 303628077,
            rank: 101,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 9765085,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646961,
            word: "Space Shuttle Challenger explodes",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U3BhY2UgU2h1dHRsZSBDaGFsbGVuZ2VyIGV4cGxvZGVz&s=YJQipnLe",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U3BhY2UgU2h1dHRsZSBDaGFsbGVuZ2VyIGV4cGxvZGVz&s=YJQipnLe&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U3BhY2UgU2h1dHRsZSBDaGFsbGVuZ2VyIGV4cGxvZGVz&s=YJQipnLe",
            definition: "1986",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Ng&s=h-dBGIuG&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4Ng&s=h-dBGIuG&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4Ng&s=h-dBGIuG&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/LGPvWbc.5OJoLtqlx96ueQ_m.jpg",
            setId: 303628077,
            rank: 98,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 25208448,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646960,
            word: "The Space Shuttle Columbia launched",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFNwYWNlIFNodXR0bGUgQ29sdW1iaWEgbGF1bmNoZWQ&s=1NXNo7IF",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFNwYWNlIFNodXR0bGUgQ29sdW1iaWEgbGF1bmNoZWQ&s=1NXNo7IF&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIFNwYWNlIFNodXR0bGUgQ29sdW1iaWEgbGF1bmNoZWQ&s=1NXNo7IF",
            definition: "1981",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4MQ&s=4xOLwoYa&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk4MQ&s=4xOLwoYa&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk4MQ&s=4xOLwoYa&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/z-M--U-m72uh-an77Md9dw_m.jpg",
            setId: 303628077,
            rank: 97,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 19346068,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646959,
            word: "The Iran hostage crisis began",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIElyYW4gaG9zdGFnZSBjcmlzaXMgYmVnYW4&s=vvJp6B-v",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIElyYW4gaG9zdGFnZSBjcmlzaXMgYmVnYW4&s=vvJp6B-v&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIElyYW4gaG9zdGFnZSBjcmlzaXMgYmVnYW4&s=vvJp6B-v",
            definition: "1979",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3OQ&s=-hxP-JqY&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3OQ&s=-hxP-JqY&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3OQ&s=-hxP-JqY&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/u8b1m-84l4V32Nh03tFVOw_m.jpg",
            setId: 303628077,
            rank: 95,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 17844177,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646958,
            word: "Jimmy Carter elected President",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SmltbXkgQ2FydGVyIGVsZWN0ZWQgUHJlc2lkZW50&s=tPfdyLqP",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SmltbXkgQ2FydGVyIGVsZWN0ZWQgUHJlc2lkZW50&s=tPfdyLqP&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SmltbXkgQ2FydGVyIGVsZWN0ZWQgUHJlc2lkZW50&s=tPfdyLqP",
            definition: "1976",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Ng&s=IZ7KW-q6&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Ng&s=IZ7KW-q6&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Ng&s=IZ7KW-q6&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/V6SdcHcKc5n-NBOYQeZdtg_m.jpg",
            setId: 303628077,
            rank: 93,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 9306891,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646957,
            word: "The World Trade Center opening",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFdvcmxkIFRyYWRlIENlbnRlciBvcGVuaW5n&s=XYmRpwjn",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFdvcmxkIFRyYWRlIENlbnRlciBvcGVuaW5n&s=XYmRpwjn&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIFdvcmxkIFRyYWRlIENlbnRlciBvcGVuaW5n&s=XYmRpwjn",
            definition: "1973",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mw&s=xF71EuGm&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mw&s=xF71EuGm&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Mw&s=xF71EuGm&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/-2cTvmSgSPDZYQg7uztxmw_m.jpg",
            setId: 303628077,
            rank: 91,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 41901938,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646956,
            word: "Gerald Ford elected President",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=R2VyYWxkIEZvcmQgZWxlY3RlZCBQcmVzaWRlbnQ&s=P0qttG.T",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R2VyYWxkIEZvcmQgZWxlY3RlZCBQcmVzaWRlbnQ&s=P0qttG.T&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=R2VyYWxkIEZvcmQgZWxlY3RlZCBQcmVzaWRlbnQ&s=P0qttG.T",
            definition: "1972",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mg&s=acn97xij&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mg&s=acn97xij&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Mg&s=acn97xij&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/XUR1-sB8runCYeo8lxe9Lg_m.jpg",
            setId: 303628077,
            rank: 89,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 9306889,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646955,
            word: "Watergate",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=V2F0ZXJnYXRl&s=ivQ030.l",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=V2F0ZXJnYXRl&s=ivQ030.l&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=V2F0ZXJnYXRl&s=ivQ030.l",
            definition: "1972",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mg&s=acn97xij&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk3Mg&s=acn97xij&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk3Mg&s=acn97xij&sublanguage=math",
            _imageUrl:
              "https://farm2.staticflickr.com/1199/1105296044_8ef0f684c4_m.jpg",
            setId: 303628077,
            rank: 88,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 17509040,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646954,
            word: "Neil Armstrong walked on the moon",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TmVpbCBBcm1zdHJvbmcgd2Fsa2VkIG9uIHRoZSBtb29u&s=-kstoaMu",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TmVpbCBBcm1zdHJvbmcgd2Fsa2VkIG9uIHRoZSBtb29u&s=-kstoaMu&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TmVpbCBBcm1zdHJvbmcgd2Fsa2VkIG9uIHRoZSBtb29u&s=-kstoaMu",
            definition: "1969",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OQ&s=rig-lDw.&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OQ&s=rig-lDw.&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2OQ&s=rig-lDw.&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/UNOLGtiYocX.w.mfmqThhg_m.jpg",
            setId: 303628077,
            rank: 87,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 13765249,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646953,
            word: "Martin Luther King Assassination",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TWFydGluIEx1dGhlciBLaW5nIEFzc2Fzc2luYXRpb24&s=Z0rcs3xF",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWFydGluIEx1dGhlciBLaW5nIEFzc2Fzc2luYXRpb24&s=Z0rcs3xF&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TWFydGluIEx1dGhlciBLaW5nIEFzc2Fzc2luYXRpb24&s=Z0rcs3xF",
            definition: "1968",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/J1dOtPUQHWFZO1Rt-P6zKQ_m.jpg",
            setId: 303628077,
            rank: 85,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 662581,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646952,
            word: "Richard Nixon first elected President",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=UmljaGFyZCBOaXhvbiBmaXJzdCBlbGVjdGVkIFByZXNpZGVudA&s=ZQFh8Ijb",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=UmljaGFyZCBOaXhvbiBmaXJzdCBlbGVjdGVkIFByZXNpZGVudA&s=ZQFh8Ijb&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=UmljaGFyZCBOaXhvbiBmaXJzdCBlbGVjdGVkIFByZXNpZGVudA&s=ZQFh8Ijb",
            definition: "1968",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2OA&s=UNpDYWwh&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/24LPHWmIjloAaBQgZawSBg_m.jpg",
            setId: 303628077,
            rank: 84,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 21172103,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646951,
            word: "Malcolm X assassination",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TWFsY29sbSBYIGFzc2Fzc2luYXRpb24&s=UiH55GU6",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWFsY29sbSBYIGFzc2Fzc2luYXRpb24&s=UiH55GU6&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TWFsY29sbSBYIGFzc2Fzc2luYXRpb24&s=UiH55GU6",
            definition: "1965",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2NQ&s=9PIHq1tm&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2NQ&s=9PIHq1tm&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2NQ&s=9PIHq1tm&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/yzZrSgGdT4PLYcIRnuMSUQ_m.jpg",
            setId: 303628077,
            rank: 83,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 13032429,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646950,
            word: "Kennedy assassination",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=S2VubmVkeSBhc3Nhc3NpbmF0aW9u&s=vv-nG.R-",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=S2VubmVkeSBhc3Nhc3NpbmF0aW9u&s=vv-nG.R-&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=S2VubmVkeSBhc3Nhc3NpbmF0aW9u&s=vv-nG.R-",
            definition: "1963",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2Mw&s=h60DSJxW&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2Mw&s=h60DSJxW&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2Mw&s=h60DSJxW&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/a8MxS1J3Lt4gOy-SB3sMpQ_m.jpg",
            setId: 303628077,
            rank: 82,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 5763361,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646948,
            word: "John F Kennedy elected President",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Sm9obiBGIEtlbm5lZHkgZWxlY3RlZCBQcmVzaWRlbnQ&s=F.HR4BQ-",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Sm9obiBGIEtlbm5lZHkgZWxlY3RlZCBQcmVzaWRlbnQ&s=F.HR4BQ-&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Sm9obiBGIEtlbm5lZHkgZWxlY3RlZCBQcmVzaWRlbnQ&s=F.HR4BQ-",
            definition: "1960",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2MA&s=XMVUU4oO&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2MA&s=XMVUU4oO&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2MA&s=XMVUU4oO&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/3P2-7zTXWgGP2LzYF0.ZIA_m.jpg",
            setId: 303628077,
            rank: 78,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 13085897,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646947,
            word: "Last version of American Flag",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TGFzdCB2ZXJzaW9uIG9mIEFtZXJpY2FuIEZsYWc&s=AU6INgk3",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TGFzdCB2ZXJzaW9uIG9mIEFtZXJpY2FuIEZsYWc&s=AU6INgk3&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TGFzdCB2ZXJzaW9uIG9mIEFtZXJpY2FuIEZsYWc&s=AU6INgk3",
            definition: "1960",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2MA&s=XMVUU4oO&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk2MA&s=XMVUU4oO&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk2MA&s=XMVUU4oO&sublanguage=math",
            _imageUrl:
              "https://farm4.staticflickr.com/3324/3555620262_8126b2b192_m.jpg",
            setId: 303628077,
            rank: 77,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20431924,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646946,
            word: "NASA was formed",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=TkFTQSB3YXMgZm9ybWVk&s=8fIVwDkk",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TkFTQSB3YXMgZm9ybWVk&s=8fIVwDkk&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=TkFTQSB3YXMgZm9ybWVk&s=8fIVwDkk",
            definition: "1958",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1OA&s=oSS9ADqL&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1OA&s=oSS9ADqL&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk1OA&s=oSS9ADqL&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/xuEtWDyYNkgcLE12w5Gi.g_m.jpg",
            setId: 303628077,
            rank: 76,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 16057531,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646945,
            word: "Death of James Dean",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgSmFtZXMgRGVhbg&s=VRfd9cGK",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgSmFtZXMgRGVhbg&s=VRfd9cGK&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgSmFtZXMgRGVhbg&s=VRfd9cGK",
            definition: "1955",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1NQ&s=OPFAtZSC&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1NQ&s=OPFAtZSC&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk1NQ&s=OPFAtZSC&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/KBkP9h1kxDOOI91-CkZGVw_m.jpg",
            setId: 303628077,
            rank: 75,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 13095790,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646944,
            word: "End of the Korean War",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RW5kIG9mIHRoZSBLb3JlYW4gV2Fy&s=iIQ-DOlj",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RW5kIG9mIHRoZSBLb3JlYW4gV2Fy&s=iIQ-DOlj&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RW5kIG9mIHRoZSBLb3JlYW4gV2Fy&s=iIQ-DOlj",
            definition: "1953",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1Mw&s=mcSjqCip&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1Mw&s=mcSjqCip&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk1Mw&s=mcSjqCip&sublanguage=math",
            _imageUrl:
              "https://farm5.staticflickr.com/4154/5022974057_f704f42806_m.jpg",
            setId: 303628077,
            rank: 74,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 19410643,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646943,
            word: "Dwight D. Eisenhower first elected President",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RHdpZ2h0IEQuIEVpc2VuaG93ZXIgZmlyc3QgZWxlY3RlZCBQcmVzaWRlbnQ&s=Sv5Xrw92",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RHdpZ2h0IEQuIEVpc2VuaG93ZXIgZmlyc3QgZWxlY3RlZCBQcmVzaWRlbnQ&s=Sv5Xrw92&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RHdpZ2h0IEQuIEVpc2VuaG93ZXIgZmlyc3QgZWxlY3RlZCBQcmVzaWRlbnQ&s=Sv5Xrw92",
            definition: "1952",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1Mg&s=6jOA2wYH&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk1Mg&s=6jOA2wYH&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk1Mg&s=6jOA2wYH&sublanguage=math",
            _imageUrl:
              "https://farm4.staticflickr.com/3016/2872023782_5bd52fe919_m.jpg",
            setId: 303628077,
            rank: 73,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 19904069,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646942,
            word: "Founding of the CIA",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Rm91bmRpbmcgb2YgdGhlIENJQQ&s=LsYzkxPr",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Rm91bmRpbmcgb2YgdGhlIENJQQ&s=LsYzkxPr&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Rm91bmRpbmcgb2YgdGhlIENJQQ&s=LsYzkxPr",
            definition: "1947",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk0Nw&s=ZTfiDX5O&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk0Nw&s=ZTfiDX5O&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk0Nw&s=ZTfiDX5O&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/rSFrNhsCmvApQpXm-GXsxQ_m.jpg",
            setId: 303628077,
            rank: 72,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 12823973,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646941,
            word: "Roswell UFO incident",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Um9zd2VsbCBVRk8gaW5jaWRlbnQ&s=6oJhDZY2",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Um9zd2VsbCBVRk8gaW5jaWRlbnQ&s=6oJhDZY2&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Um9zd2VsbCBVRk8gaW5jaWRlbnQ&s=6oJhDZY2",
            definition: "1947",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk0Nw&s=ZTfiDX5O&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk0Nw&s=ZTfiDX5O&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk0Nw&s=ZTfiDX5O&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/CiLAF6OGEOb50cRqIN4hlQ_m.jpg",
            setId: 303628077,
            rank: 71,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 22070247,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646940,
            word: "Little Boy explodes over Hiroshima, Japan",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TGl0dGxlIEJveSBleHBsb2RlcyBvdmVyIEhpcm9zaGltYSwgSmFwYW4&s=hyPj3Pt7",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TGl0dGxlIEJveSBleHBsb2RlcyBvdmVyIEhpcm9zaGltYSwgSmFwYW4&s=hyPj3Pt7&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TGl0dGxlIEJveSBleHBsb2RlcyBvdmVyIEhpcm9zaGltYSwgSmFwYW4&s=hyPj3Pt7",
            definition: "1945",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk0NQ&s=CL3cufpv&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk0NQ&s=CL3cufpv&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk0NQ&s=CL3cufpv&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/ektTIoPcrIVwfRQXSLjceg_m.jpg",
            setId: 303628077,
            rank: 70,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 21279713,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646939,
            word: "Normandy Landing",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=Tm9ybWFuZHkgTGFuZGluZw&s=BeJpevgF",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Tm9ybWFuZHkgTGFuZGluZw&s=BeJpevgF&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Tm9ybWFuZHkgTGFuZGluZw&s=BeJpevgF",
            definition: "1944",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk0NA&s=zvythDnM&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk0NA&s=zvythDnM&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk0NA&s=zvythDnM&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/v6DN3mMsjGta8LiuM9LCKw_m.jpg",
            setId: 303628077,
            rank: 69,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 18995855,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646938,
            word: "Pearl Harbor",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=UGVhcmwgSGFyYm9y&s=wMqz2Pb4",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=UGVhcmwgSGFyYm9y&s=wMqz2Pb4&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=UGVhcmwgSGFyYm9y&s=wMqz2Pb4",
            definition: "1941",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTk0MQ&s=TSmWl3Da&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTk0MQ&s=TSmWl3Da&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTk0MQ&s=TSmWl3Da&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/rQQCd.2nehP9ubMoJa0-4w_m.jpg",
            setId: 303628077,
            rank: 68,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 13659548,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646937,
            word: "The Golden Gate Bridge opening",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEdvbGRlbiBHYXRlIEJyaWRnZSBvcGVuaW5n&s=k4bUMRVa",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEdvbGRlbiBHYXRlIEJyaWRnZSBvcGVuaW5n&s=k4bUMRVa&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIEdvbGRlbiBHYXRlIEJyaWRnZSBvcGVuaW5n&s=k4bUMRVa",
            definition: "1937",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkzNw&s=KHztZ2xx&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkzNw&s=KHztZ2xx&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkzNw&s=KHztZ2xx&sublanguage=math",
            _imageUrl:
              "https://farm1.staticflickr.com/157/402618628_fd2a492d05_m.jpg",
            setId: 303628077,
            rank: 66,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 18011741,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646936,
            word: "Franklin D. Roosevelt first elected President",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RnJhbmtsaW4gRC4gUm9vc2V2ZWx0IGZpcnN0IGVsZWN0ZWQgUHJlc2lkZW50&s=LFqR-Psk",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RnJhbmtsaW4gRC4gUm9vc2V2ZWx0IGZpcnN0IGVsZWN0ZWQgUHJlc2lkZW50&s=LFqR-Psk&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RnJhbmtsaW4gRC4gUm9vc2V2ZWx0IGZpcnN0IGVsZWN0ZWQgUHJlc2lkZW50&s=LFqR-Psk",
            definition: "1932",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkzMg&s=y6B0qI40&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkzMg&s=y6B0qI40&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkzMg&s=y6B0qI40&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/h6dCCq0adX9IWQ-3jh5E2w_m.jpg",
            setId: 303628077,
            rank: 65,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 21171624,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646935,
            word: "Al Capone convicted for tax evasion",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QWwgQ2Fwb25lIGNvbnZpY3RlZCBmb3IgdGF4IGV2YXNpb24&s=PeOb56Xa",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QWwgQ2Fwb25lIGNvbnZpY3RlZCBmb3IgdGF4IGV2YXNpb24&s=PeOb56Xa&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QWwgQ2Fwb25lIGNvbnZpY3RlZCBmb3IgdGF4IGV2YXNpb24&s=PeOb56Xa",
            definition: "1931",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkzMQ&s=OnDxFaKp&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkzMQ&s=OnDxFaKp&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkzMQ&s=OnDxFaKp&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/WJH3IWDcyWlEXiZtWJcBgg_m.jpg",
            setId: 303628077,
            rank: 64,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 16061821,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646934,
            word: "The Empire State Building opening",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEVtcGlyZSBTdGF0ZSBCdWlsZGluZyBvcGVuaW5n&s=cKDH-Hl4",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEVtcGlyZSBTdGF0ZSBCdWlsZGluZyBvcGVuaW5n&s=cKDH-Hl4&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIEVtcGlyZSBTdGF0ZSBCdWlsZGluZyBvcGVuaW5n&s=cKDH-Hl4",
            definition: "1931",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkzMQ&s=OnDxFaKp&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkzMQ&s=OnDxFaKp&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkzMQ&s=OnDxFaKp&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/JSUcphk67y4YbebiMCNeUQ_m.png",
            setId: 303628077,
            rank: 63,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 1674507,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646933,
            word: "Beginning of the Great Depression",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmVnaW5uaW5nIG9mIHRoZSBHcmVhdCBEZXByZXNzaW9u&s=giW.UosZ",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmVnaW5uaW5nIG9mIHRoZSBHcmVhdCBEZXByZXNzaW9u&s=giW.UosZ&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmVnaW5uaW5nIG9mIHRoZSBHcmVhdCBEZXByZXNzaW9u&s=giW.UosZ",
            definition: "1929",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkyOQ&s=3KBuSn0l&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkyOQ&s=3KBuSn0l&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkyOQ&s=3KBuSn0l&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/7z_2pHBjfBrFru7ru3x2ew_m.jpg",
            setId: 303628077,
            rank: 62,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 18353099,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646932,
            word: "J. Edgar Hoover appointed Director of the Bureau of Investigation",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Si4gRWRnYXIgSG9vdmVyIGFwcG9pbnRlZCBEaXJlY3RvciBvZiB0aGUgQnVyZWF1IG9mIEludmVzdGlnYXRpb24&s=uki.iyQC",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Si4gRWRnYXIgSG9vdmVyIGFwcG9pbnRlZCBEaXJlY3RvciBvZiB0aGUgQnVyZWF1IG9mIEludmVzdGlnYXRpb24&s=uki.iyQC&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Si4gRWRnYXIgSG9vdmVyIGFwcG9pbnRlZCBEaXJlY3RvciBvZiB0aGUgQnVyZWF1IG9mIEludmVzdGlnYXRpb24&s=uki.iyQC",
            definition: "1924",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkyNA&s=0-xIHr6s&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkyNA&s=0-xIHr6s&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkyNA&s=0-xIHr6s&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/C0F8eJZHKlYvbFWXeBhWLw_m.png",
            setId: 303628077,
            rank: 60,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 19139434,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646931,
            word: "The Nineteenth Amendment",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIE5pbmV0ZWVudGggQW1lbmRtZW50&s=RjASNHtb",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIE5pbmV0ZWVudGggQW1lbmRtZW50&s=RjASNHtb&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIE5pbmV0ZWVudGggQW1lbmRtZW50&s=RjASNHtb",
            definition: "1920",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkyMA&s=9h3GETPo&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkyMA&s=9h3GETPo&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkyMA&s=9h3GETPo&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/Nd2IJb82jKbH7b7HXTaKQw_m.jpg",
            setId: 303628077,
            rank: 58,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20268426,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646930,
            word: "Beginning of Prohibition",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmVnaW5uaW5nIG9mIFByb2hpYml0aW9u&s=mPllBoWV",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmVnaW5uaW5nIG9mIFByb2hpYml0aW9u&s=mPllBoWV&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmVnaW5uaW5nIG9mIFByb2hpYml0aW9u&s=mPllBoWV",
            definition: "1919",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkxOQ&s=vj70sB1I&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkxOQ&s=vj70sB1I&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkxOQ&s=vj70sB1I&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/hq1pMjp658X92tDWP5a9Sw_m.jpg",
            setId: 303628077,
            rank: 57,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 18995896,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646929,
            word: "The United States' involvement in World War I",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFVuaXRlZCBTdGF0ZXMnIGludm9sdmVtZW50IGluIFdvcmxkIFdhciBJ&s=1g.Txk6S",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFVuaXRlZCBTdGF0ZXMnIGludm9sdmVtZW50IGluIFdvcmxkIFdhciBJ&s=1g.Txk6S&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIFVuaXRlZCBTdGF0ZXMnIGludm9sdmVtZW50IGluIFdvcmxkIFdhciBJ&s=1g.Txk6S",
            definition: "1917",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkxNw&s=wSCdXQnb&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkxNw&s=wSCdXQnb&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkxNw&s=wSCdXQnb&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/rQQCd.2nehP9ubMoJa0-4w_m.jpg",
            setId: 303628077,
            rank: 56,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 13659548,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646928,
            word: "Woodrow Wilson first elected President",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=V29vZHJvdyBXaWxzb24gZmlyc3QgZWxlY3RlZCBQcmVzaWRlbnQ&s=araeQ49r",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=V29vZHJvdyBXaWxzb24gZmlyc3QgZWxlY3RlZCBQcmVzaWRlbnQ&s=araeQ49r&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=V29vZHJvdyBXaWxzb24gZmlyc3QgZWxlY3RlZCBQcmVzaWRlbnQ&s=araeQ49r",
            definition: "1912",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkxMg&s=t4BgyHMi&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkxMg&s=t4BgyHMi&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkxMg&s=t4BgyHMi&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/NUPaqleXsEKlbyHYw3vhXw_m.jpg",
            setId: 303628077,
            rank: 55,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 21171917,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646927,
            word: "The Titanic sinks",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFRpdGFuaWMgc2lua3M&s=KE4vbMXh",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFRpdGFuaWMgc2lua3M&s=KE4vbMXh&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIFRpdGFuaWMgc2lua3M&s=KE4vbMXh",
            definition: "1912",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkxMg&s=t4BgyHMi&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkxMg&s=t4BgyHMi&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkxMg&s=t4BgyHMi&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/kOOO1l9BpC4Weh-JTmv1iw_m.jpg",
            setId: 303628077,
            rank: 54,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 14771479,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646926,
            word: "The Boy Scouts of America was chartered",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEJveSBTY291dHMgb2YgQW1lcmljYSB3YXMgY2hhcnRlcmVk&s=HSTtZsmv",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEJveSBTY291dHMgb2YgQW1lcmljYSB3YXMgY2hhcnRlcmVk&s=HSTtZsmv&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIEJveSBTY291dHMgb2YgQW1lcmljYSB3YXMgY2hhcnRlcmVk&s=HSTtZsmv",
            definition: "1910",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkxMA&s=y8TnHuuL&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkxMA&s=y8TnHuuL&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkxMA&s=y8TnHuuL&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/VWIui3lmfMW5R2vdqg5KUA_m.jpg",
            setId: 303628077,
            rank: 53,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 21271500,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646925,
            word: "Wright Brothers' first flight",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=V3JpZ2h0IEJyb3RoZXJzJyBmaXJzdCBmbGlnaHQ&s=VG11iSAO",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=V3JpZ2h0IEJyb3RoZXJzJyBmaXJzdCBmbGlnaHQ&s=VG11iSAO&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=V3JpZ2h0IEJyb3RoZXJzJyBmaXJzdCBmbGlnaHQ&s=VG11iSAO",
            definition: "1903",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTkwMw&s=AZAPA.dy&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTkwMw&s=AZAPA.dy&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTkwMw&s=AZAPA.dy&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/F8gl9nMdgtbmTWaIJRHe6A_m.jpg",
            setId: 303628077,
            rank: 51,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 1013822,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646924,
            word: "Inauguration of Brooklyn Bridge",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SW5hdWd1cmF0aW9uIG9mIEJyb29rbHluIEJyaWRnZQ&s=Bh32GRdY",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SW5hdWd1cmF0aW9uIG9mIEJyb29rbHluIEJyaWRnZQ&s=Bh32GRdY&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SW5hdWd1cmF0aW9uIG9mIEJyb29rbHluIEJyaWRnZQ&s=Bh32GRdY",
            definition: "1883",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg4Mw&s=15Owbtu7&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg4Mw&s=15Owbtu7&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg4Mw&s=15Owbtu7&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/2Z3LFz.A.Fp2OaHcgpT1Aw_m.jpg",
            setId: 303628077,
            rank: 48,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 19335077,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646923,
            word: "Death of Jesse James",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgSmVzc2UgSmFtZXM&s=Ig-hY.N8",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgSmVzc2UgSmFtZXM&s=Ig-hY.N8&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgSmVzc2UgSmFtZXM&s=Ig-hY.N8",
            definition: "1882",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg4Mg&s=bf7M3xbq&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg4Mg&s=bf7M3xbq&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg4Mg&s=bf7M3xbq&sublanguage=math",
            _imageUrl:
              "https://farm8.staticflickr.com/7277/6941769612_8aa1559437_m.jpg",
            setId: 303628077,
            rank: 47,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 4295852,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646922,
            word: "Gunfight at the OK Corral",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=R3VuZmlnaHQgYXQgdGhlIE9LIENvcnJhbA&s=E.n6kASA",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R3VuZmlnaHQgYXQgdGhlIE9LIENvcnJhbA&s=E.n6kASA&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=R3VuZmlnaHQgYXQgdGhlIE9LIENvcnJhbA&s=E.n6kASA",
            definition: "1881",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg4MQ&s=EJb3OaRI&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg4MQ&s=EJb3OaRI&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg4MQ&s=EJb3OaRI&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/53tjpk.3-MbqGdURh-OaCw_m.png",
            setId: 303628077,
            rank: 46,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 29334306,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646921,
            word: "Death of Billy the Kid",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgQmlsbHkgdGhlIEtpZA&s=ypF9MdHp",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgQmlsbHkgdGhlIEtpZA&s=ypF9MdHp&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgQmlsbHkgdGhlIEtpZA&s=ypF9MdHp",
            definition: "1881",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg4MQ&s=EJb3OaRI&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg4MQ&s=EJb3OaRI&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg4MQ&s=EJb3OaRI&sublanguage=math",
            _imageUrl:
              "https://farm4.staticflickr.com/3454/3402285041_672ac305a5_m.jpg",
            setId: 303628077,
            rank: 45,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 19993467,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646920,
            word: "Death of Wild Bill Hickock",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgV2lsZCBCaWxsIEhpY2tvY2s&s=FL5it-6d",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgV2lsZCBCaWxsIEhpY2tvY2s&s=FL5it-6d&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgV2lsZCBCaWxsIEhpY2tvY2s&s=FL5it-6d",
            definition: "1876",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg3Ng&s=2YKcH3JB&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg3Ng&s=2YKcH3JB&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg3Ng&s=2YKcH3JB&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/Xwdt1SUebJ2Se9BkJQk9XA_m.jpg",
            setId: 303628077,
            rank: 44,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 11457407,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646919,
            word: "Battle of the Little Bighorn",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmF0dGxlIG9mIHRoZSBMaXR0bGUgQmlnaG9ybg&s=fhGAfnte",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmF0dGxlIG9mIHRoZSBMaXR0bGUgQmlnaG9ybg&s=fhGAfnte&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmF0dGxlIG9mIHRoZSBMaXR0bGUgQmlnaG9ybg&s=fhGAfnte",
            definition: "1876",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg3Ng&s=2YKcH3JB&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg3Ng&s=2YKcH3JB&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg3Ng&s=2YKcH3JB&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/ofsCeo53K-90re8BxErF6w_m.jpg",
            setId: 303628077,
            rank: 43,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 18724325,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646917,
            word: "The Pacific Railroad",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFBhY2lmaWMgUmFpbHJvYWQ&s=sDiib3m1",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFBhY2lmaWMgUmFpbHJvYWQ&s=sDiib3m1&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIFBhY2lmaWMgUmFpbHJvYWQ&s=sDiib3m1",
            definition: "1869",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2OQ&s=UX4iyl7-&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2OQ&s=UX4iyl7-&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg2OQ&s=UX4iyl7-&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/-yVLY9IVWfKKn6rrsFOd5Q_m.png",
            setId: 303628077,
            rank: 41,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 16060967,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646916,
            word: "Transcontinental Railroad completed",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VHJhbnNjb250aW5lbnRhbCBSYWlscm9hZCBjb21wbGV0ZWQ&s=TZ8aPuyT",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VHJhbnNjb250aW5lbnRhbCBSYWlscm9hZCBjb21wbGV0ZWQ&s=TZ8aPuyT&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VHJhbnNjb250aW5lbnRhbCBSYWlscm9hZCBjb21wbGV0ZWQ&s=TZ8aPuyT",
            definition: "1869",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2OQ&s=UX4iyl7-&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2OQ&s=UX4iyl7-&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg2OQ&s=UX4iyl7-&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/T.RpNFe55Aq3vJJiljhHdg_m.jpg",
            setId: 303628077,
            rank: 40,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20302930,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646914,
            word: "Ulysses S. Grant first elected President",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VWx5c3NlcyBTLiBHcmFudCBmaXJzdCBlbGVjdGVkIFByZXNpZGVudA&s=2UUDOxLf",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VWx5c3NlcyBTLiBHcmFudCBmaXJzdCBlbGVjdGVkIFByZXNpZGVudA&s=2UUDOxLf&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VWx5c3NlcyBTLiBHcmFudCBmaXJzdCBlbGVjdGVkIFByZXNpZGVudA&s=2UUDOxLf",
            definition: "1868",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2OA&s=FAZPvP2E&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2OA&s=FAZPvP2E&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg2OA&s=FAZPvP2E&sublanguage=math",
            _imageUrl:
              "https://farm3.staticflickr.com/2796/4420203413_241bc4df3b_m.jpg",
            setId: 303628077,
            rank: 39,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20469756,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646913,
            word: "Abraham Lincoln Assassinated",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QWJyYWhhbSBMaW5jb2xuIEFzc2Fzc2luYXRlZA&s=OhQL4MTG",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QWJyYWhhbSBMaW5jb2xuIEFzc2Fzc2luYXRlZA&s=OhQL4MTG&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QWJyYWhhbSBMaW5jb2xuIEFzc2Fzc2luYXRlZA&s=OhQL4MTG",
            definition: "1865",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2NQ&s=OeaNTamq&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2NQ&s=OeaNTamq&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg2NQ&s=OeaNTamq&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/R1OmIqqeny7QEWc.hrMD4w_m.jpg",
            setId: 303628077,
            rank: 37,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20733563,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646912,
            word: "Last Battle of the Civil War",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TGFzdCBCYXR0bGUgb2YgdGhlIENpdmlsIFdhcg&s=tbP.TFdg",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TGFzdCBCYXR0bGUgb2YgdGhlIENpdmlsIFdhcg&s=tbP.TFdg&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TGFzdCBCYXR0bGUgb2YgdGhlIENpdmlsIFdhcg&s=tbP.TFdg",
            definition: "1865",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2NQ&s=OeaNTamq&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2NQ&s=OeaNTamq&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg2NQ&s=OeaNTamq&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/gQZDx.bzjde0igyRN2T3-g_m.jpg",
            setId: 303628077,
            rank: 36,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 11390586,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646911,
            word: "The Sand Creek massacre",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFNhbmQgQ3JlZWsgbWFzc2FjcmU&s=Ad7O6JbY",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFNhbmQgQ3JlZWsgbWFzc2FjcmU&s=Ad7O6JbY&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIFNhbmQgQ3JlZWsgbWFzc2FjcmU&s=Ad7O6JbY",
            definition: "1864",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2NA&s=899njSDq&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2NA&s=899njSDq&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg2NA&s=899njSDq&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/Y43jr2IyTtqVp0YvViwusQ_m.jpg",
            setId: 303628077,
            rank: 35,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 17719165,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646910,
            word: "Battle of Gettysburg",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmF0dGxlIG9mIEdldHR5c2J1cmc&s=wg2UJutk",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmF0dGxlIG9mIEdldHR5c2J1cmc&s=wg2UJutk&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmF0dGxlIG9mIEdldHR5c2J1cmc&s=wg2UJutk",
            definition: "1863",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2Mw&s=cWFhlwK9&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2Mw&s=cWFhlwK9&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg2Mw&s=cWFhlwK9&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/ajgf3Dx-13GlHuh32T0byA_m.jpg",
            setId: 303628077,
            rank: 34,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20469758,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646909,
            word: "The American Civil War (beginning)",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEFtZXJpY2FuIENpdmlsIFdhciAoYmVnaW5uaW5nKQ&s=3E.z-8VO",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEFtZXJpY2FuIENpdmlsIFdhciAoYmVnaW5uaW5nKQ&s=3E.z-8VO&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIEFtZXJpY2FuIENpdmlsIFdhciAoYmVnaW5uaW5nKQ&s=3E.z-8VO",
            definition: "1861",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2MQ&s=x641Y9er&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2MQ&s=x641Y9er&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg2MQ&s=x641Y9er&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/Zt1ta53Moh2PeC-NpZkmwg_m.jpg",
            setId: 303628077,
            rank: 33,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20469753,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646908,
            word: "Abraham Lincoln elected President",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QWJyYWhhbSBMaW5jb2xuIGVsZWN0ZWQgUHJlc2lkZW50&s=L1z.S9dj",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QWJyYWhhbSBMaW5jb2xuIGVsZWN0ZWQgUHJlc2lkZW50&s=L1z.S9dj&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QWJyYWhhbSBMaW5jb2xuIGVsZWN0ZWQgUHJlc2lkZW50&s=L1z.S9dj",
            definition: "1860",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2MA&s=yJP5W4X3&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg2MA&s=yJP5W4X3&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg2MA&s=yJP5W4X3&sublanguage=math",
            _imageUrl:
              "https://farm3.staticflickr.com/2268/2393882882_9317266cb7_m.jpg",
            setId: 303628077,
            rank: 32,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20605863,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646907,
            word: "Creation of the Republican Party",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Q3JlYXRpb24gb2YgdGhlIFJlcHVibGljYW4gUGFydHk&s=9sMfvOO-",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Q3JlYXRpb24gb2YgdGhlIFJlcHVibGljYW4gUGFydHk&s=9sMfvOO-&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Q3JlYXRpb24gb2YgdGhlIFJlcHVibGljYW4gUGFydHk&s=9sMfvOO-",
            definition: "1854",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg1NA&s=DpZFBONP&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg1NA&s=DpZFBONP&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg1NA&s=DpZFBONP&sublanguage=math",
            _imageUrl:
              "https://farm7.staticflickr.com/6035/6261666821_63ddf64c7d_m.jpg",
            setId: 303628077,
            rank: 30,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 19999587,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646906,
            word: "California enters the Unites States (31st state)",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Q2FsaWZvcm5pYSBlbnRlcnMgdGhlIFVuaXRlcyBTdGF0ZXMgKDMxc3Qgc3RhdGUp&s=ZxcXsnU-",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Q2FsaWZvcm5pYSBlbnRlcnMgdGhlIFVuaXRlcyBTdGF0ZXMgKDMxc3Qgc3RhdGUp&s=ZxcXsnU-&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Q2FsaWZvcm5pYSBlbnRlcnMgdGhlIFVuaXRlcyBTdGF0ZXMgKDMxc3Qgc3RhdGUp&s=ZxcXsnU-",
            definition: "1850",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg1MA&s=68911NC1&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg1MA&s=68911NC1&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg1MA&s=68911NC1&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/jOOlLQgBBa7Gi8HuXao5Bw_m.jpg",
            setId: 303628077,
            rank: 29,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20570856,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646905,
            word: "Texas became the 28th state",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGV4YXMgYmVjYW1lIHRoZSAyOHRoIHN0YXRl&s=lqfKfzNg",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGV4YXMgYmVjYW1lIHRoZSAyOHRoIHN0YXRl&s=lqfKfzNg&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGV4YXMgYmVjYW1lIHRoZSAyOHRoIHN0YXRl&s=lqfKfzNg",
            definition: "1845",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTg0NQ&s=hrDBpU2p&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTg0NQ&s=hrDBpU2p&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTg0NQ&s=hrDBpU2p&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/gD1PCVT8e9wPNYafeOpuRQ_m.jpg",
            setId: 303628077,
            rank: 27,
            lastModified: 1530169757,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 14795105,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800406,
            word: "White House Inaugurated",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=V2hpdGUgSG91c2UgSW5hdWd1cmF0ZWQ&s=fyTKlWgO",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=V2hpdGUgSG91c2UgSW5hdWd1cmF0ZWQ&s=fyTKlWgO&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=V2hpdGUgSG91c2UgSW5hdWd1cmF0ZWQ&s=fyTKlWgO",
            definition: "1800",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTgwMA&s=U3uBcEnQ&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTgwMA&s=U3uBcEnQ&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTgwMA&s=U3uBcEnQ&sublanguage=math",
            _imageUrl:
              "https://farm1.staticflickr.com/102/262858376_b058df39ff_m.jpg",
            setId: 303628077,
            rank: 19,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 18054365,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800405,
            word: "Death of George Washington",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgR2VvcmdlIFdhc2hpbmd0b24&s=ElKtcHzl",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgR2VvcmdlIFdhc2hpbmd0b24&s=ElKtcHzl&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgR2VvcmdlIFdhc2hpbmd0b24&s=ElKtcHzl",
            definition: "1799",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTc5OQ&s=YMOuSsrJ&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTc5OQ&s=YMOuSsrJ&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTc5OQ&s=YMOuSsrJ&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/hYPeWOupExGt6AmXDF28UQ_m.jpg",
            setId: 303628077,
            rank: 18,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 19670104,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800404,
            word: "The Great Fire of New York",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEdyZWF0IEZpcmUgb2YgTmV3IFlvcms&s=gDgIslsN",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEdyZWF0IEZpcmUgb2YgTmV3IFlvcms&s=gDgIslsN&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIEdyZWF0IEZpcmUgb2YgTmV3IFlvcms&s=gDgIslsN",
            definition: "1776",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTc3Ng&s=J5bEolGv&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTc3Ng&s=J5bEolGv&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTc3Ng&s=J5bEolGv&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/qM4DOMXpkyxdqph0vwqTbA_m.jpg",
            setId: 303628077,
            rank: 12,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 1023484,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800403,
            word: "Salem Witch Trials",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U2FsZW0gV2l0Y2ggVHJpYWxz&s=SjNf6Yod",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2FsZW0gV2l0Y2ggVHJpYWxz&s=SjNf6Yod&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U2FsZW0gV2l0Y2ggVHJpYWxz&s=SjNf6Yod",
            definition: "1692",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTY5Mg&s=LTh1vDYt&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTY5Mg&s=LTh1vDYt&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTY5Mg&s=LTh1vDYt&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/Kf2w-9vdAyFXJIo8GVrmLg_m.jpg",
            setId: 303628077,
            rank: 7,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 15269627,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295800402,
            word: "Foundation of Harvard College",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Rm91bmRhdGlvbiBvZiBIYXJ2YXJkIENvbGxlZ2U&s=lXdPHQmg",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Rm91bmRhdGlvbiBvZiBIYXJ2YXJkIENvbGxlZ2U&s=lXdPHQmg&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Rm91bmRhdGlvbiBvZiBIYXJ2YXJkIENvbGxlZ2U&s=lXdPHQmg",
            definition: "1636",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTYzNg&s=OWdIVvWc&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTYzNg&s=OWdIVvWc&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTYzNg&s=OWdIVvWc&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/gAZrX--jTLbv6mIaY3ocng_m.jpg",
            setId: 303628077,
            rank: 6,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 3745568,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646904,
            word: "Battle of the Alamo",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmF0dGxlIG9mIHRoZSBBbGFtbw&s=D7W77gvJ",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmF0dGxlIG9mIHRoZSBBbGFtbw&s=D7W77gvJ&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmF0dGxlIG9mIHRoZSBBbGFtbw&s=D7W77gvJ",
            definition: "1836",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTgzNg&s=iRP9VMvb&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTgzNg&s=iRP9VMvb&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTgzNg&s=iRP9VMvb&sublanguage=math",
            _imageUrl:
              "https://farm4.staticflickr.com/3303/3657612412_5e0ddbb47f_m.jpg",
            setId: 303628077,
            rank: 26,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 288000,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646903,
            word: "Andrew Jackson first elected President",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QW5kcmV3IEphY2tzb24gZmlyc3QgZWxlY3RlZCBQcmVzaWRlbnQ&s=w4S7JFOS",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QW5kcmV3IEphY2tzb24gZmlyc3QgZWxlY3RlZCBQcmVzaWRlbnQ&s=w4S7JFOS&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QW5kcmV3IEphY2tzb24gZmlyc3QgZWxlY3RlZCBQcmVzaWRlbnQ&s=w4S7JFOS",
            definition: "1828",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTgyOA&s=JQuw6jkJ&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTgyOA&s=JQuw6jkJ&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTgyOA&s=JQuw6jkJ&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/IafkEaxX32_aGxB96nRy5A_m.jpg",
            setId: 303628077,
            rank: 25,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20409834,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646902,
            word: "End of the War of 1812",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RW5kIG9mIHRoZSBXYXIgb2YgMTgxMg&s=NAdfHsKI",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RW5kIG9mIHRoZSBXYXIgb2YgMTgxMg&s=NAdfHsKI&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RW5kIG9mIHRoZSBXYXIgb2YgMTgxMg&s=NAdfHsKI",
            definition: "1815",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTgxNQ&s=3884vzw-&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTgxNQ&s=3884vzw-&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTgxNQ&s=3884vzw-&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/j9ETLvb9Qabo8aqDSKL8rQ_m.jpg",
            setId: 303628077,
            rank: 24,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20312903,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646901,
            word: "Burning of Washington",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QnVybmluZyBvZiBXYXNoaW5ndG9u&s=8xAyxrUS",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QnVybmluZyBvZiBXYXNoaW5ndG9u&s=8xAyxrUS&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QnVybmluZyBvZiBXYXNoaW5ndG9u&s=8xAyxrUS",
            definition: "1814",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTgxNA&s=Agxx2FvF&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTgxNA&s=Agxx2FvF&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTgxNA&s=Agxx2FvF&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/9.t9ltvBElBI0Gu4qzswhg_m.jpg",
            setId: 303628077,
            rank: 23,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20998044,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646899,
            word: "Louisiana Purchase",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TG91aXNpYW5hIFB1cmNoYXNl&s=-S1jchj-",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TG91aXNpYW5hIFB1cmNoYXNl&s=-S1jchj-&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TG91aXNpYW5hIFB1cmNoYXNl&s=-S1jchj-",
            definition: "1803",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTgwMw&s=Ip6RTGMx&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTgwMw&s=Ip6RTGMx&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTgwMw&s=Ip6RTGMx&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/pwaw76JiqXHFjThQAIf8Pw_m.jpg",
            setId: 303628077,
            rank: 21,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 18693840,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646898,
            word: "Thomas Jefferson first elected President",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhvbWFzIEplZmZlcnNvbiBmaXJzdCBlbGVjdGVkIFByZXNpZGVudA&s=2L3lMzKD",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhvbWFzIEplZmZlcnNvbiBmaXJzdCBlbGVjdGVkIFByZXNpZGVudA&s=2L3lMzKD&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhvbWFzIEplZmZlcnNvbiBmaXJzdCBlbGVjdGVkIFByZXNpZGVudA&s=2L3lMzKD",
            definition: "1800",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTgwMA&s=U3uBcEnQ&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTgwMA&s=U3uBcEnQ&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTgwMA&s=U3uBcEnQ&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/hKgSN9aK2A4_PNHJ9xdsKg_m.jpg",
            setId: 303628077,
            rank: 20,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20409830,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646897,
            word: "John Adams elected President",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Sm9obiBBZGFtcyBlbGVjdGVkIFByZXNpZGVudA&s=vuRFnH4J",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Sm9obiBBZGFtcyBlbGVjdGVkIFByZXNpZGVudA&s=vuRFnH4J&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Sm9obiBBZGFtcyBlbGVjdGVkIFByZXNpZGVudA&s=vuRFnH4J",
            definition: "1796",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTc5Ng&s=ktsCTuKo&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTc5Ng&s=ktsCTuKo&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTc5Ng&s=ktsCTuKo&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/eQSyAeRG542l5Rw1lCSThw_m.jpg",
            setId: 303628077,
            rank: 17,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 11053520,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646896,
            word: "George Washington first elected President",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=R2VvcmdlIFdhc2hpbmd0b24gZmlyc3QgZWxlY3RlZCBQcmVzaWRlbnQ&s=g-j4sitP",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R2VvcmdlIFdhc2hpbmd0b24gZmlyc3QgZWxlY3RlZCBQcmVzaWRlbnQ&s=g-j4sitP&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=R2VvcmdlIFdhc2hpbmd0b24gZmlyc3QgZWxlY3RlZCBQcmVzaWRlbnQ&s=g-j4sitP",
            definition: "1789",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTc4OQ&s=oBuIoTVC&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTc4OQ&s=oBuIoTVC&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTc4OQ&s=oBuIoTVC&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/byzqSZ152PIwoLgFHdFhFw_m.jpg",
            setId: 303628077,
            rank: 16,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20449509,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646895,
            word: "The Constitution of the United States",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIENvbnN0aXR1dGlvbiBvZiB0aGUgVW5pdGVkIFN0YXRlcw&s=8VaMDDcg",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIENvbnN0aXR1dGlvbiBvZiB0aGUgVW5pdGVkIFN0YXRlcw&s=8VaMDDcg&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIENvbnN0aXR1dGlvbiBvZiB0aGUgVW5pdGVkIFN0YXRlcw&s=8VaMDDcg",
            definition: "1787",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTc4Nw&s=i3J3V2I5&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTc4Nw&s=i3J3V2I5&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTc4Nw&s=i3J3V2I5&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/WLCPoJhr7Adw4lqXQ7vJ7w_m.jpg",
            setId: 303628077,
            rank: 15,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20277993,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646894,
            word: "Treaty of Paris",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=VHJlYXR5IG9mIFBhcmlz&s=NNip8nx7",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VHJlYXR5IG9mIFBhcmlz&s=NNip8nx7&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=VHJlYXR5IG9mIFBhcmlz&s=NNip8nx7",
            definition: "1783",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTc4Mw&s=7MicAs1E&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTc4Mw&s=7MicAs1E&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTc4Mw&s=7MicAs1E&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/KyU7TIV8iPBEVsdvlKcKlw_m.jpg",
            setId: 303628077,
            rank: 14,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 9691074,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646893,
            word: 'First American Flag "Star Spangled Banner"',
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Rmlyc3QgQW1lcmljYW4gRmxhZyAiU3RhciBTcGFuZ2xlZCBCYW5uZXIi&s=8Uo7uye5",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Rmlyc3QgQW1lcmljYW4gRmxhZyAiU3RhciBTcGFuZ2xlZCBCYW5uZXIi&s=8Uo7uye5&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Rmlyc3QgQW1lcmljYW4gRmxhZyAiU3RhciBTcGFuZ2xlZCBCYW5uZXIi&s=8Uo7uye5",
            definition: "1777",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTc3Nw&s=dDDuVzfQ&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTc3Nw&s=dDDuVzfQ&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTc3Nw&s=dDDuVzfQ&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/1JDu5Qw8.Alg3xHec-dFTQ_m.jpg",
            setId: 303628077,
            rank: 13,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 12008537,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646892,
            word: "The Declaration of Independence",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIERlY2xhcmF0aW9uIG9mIEluZGVwZW5kZW5jZQ&s=mbQbpkwR",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIERlY2xhcmF0aW9uIG9mIEluZGVwZW5kZW5jZQ&s=mbQbpkwR&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIERlY2xhcmF0aW9uIG9mIEluZGVwZW5kZW5jZQ&s=mbQbpkwR",
            definition: "1776",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTc3Ng&s=J5bEolGv&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTc3Ng&s=J5bEolGv&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTc3Ng&s=J5bEolGv&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/KP7pGwT6bky39oKFgFKr4g_m.jpg",
            setId: 303628077,
            rank: 11,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20277989,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646891,
            word: "Boston Tea Party",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=Qm9zdG9uIFRlYSBQYXJ0eQ&s=-PFb5Pw5",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Qm9zdG9uIFRlYSBQYXJ0eQ&s=-PFb5Pw5&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Qm9zdG9uIFRlYSBQYXJ0eQ&s=-PFb5Pw5",
            definition: "1773",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTc3Mw&s=w4986wyO&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTc3Mw&s=w4986wyO&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTc3Mw&s=w4986wyO&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/n1wNl85euLPQyQyQYQCg5w_m.jpg",
            setId: 303628077,
            rank: 10,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 19937301,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646889,
            word: "Benjamin Franklin's Kite experiment",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmVuamFtaW4gRnJhbmtsaW4ncyBLaXRlIGV4cGVyaW1lbnQ&s=78cebRek",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmVuamFtaW4gRnJhbmtsaW4ncyBLaXRlIGV4cGVyaW1lbnQ&s=78cebRek&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmVuamFtaW4gRnJhbmtsaW4ncyBLaXRlIGV4cGVyaW1lbnQ&s=78cebRek",
            definition: "1752",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTc1Mg&s=19SvCREy&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTc1Mg&s=19SvCREy&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTc1Mg&s=19SvCREy&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/KmMkIi73aVWM9vkyFMLOuA_m.jpg",
            setId: 303628077,
            rank: 8,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 4750778,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646888,
            word: "New Amsterdam was founded",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TmV3IEFtc3RlcmRhbSB3YXMgZm91bmRlZA&s=36rR.n9r",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TmV3IEFtc3RlcmRhbSB3YXMgZm91bmRlZA&s=36rR.n9r&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TmV3IEFtc3RlcmRhbSB3YXMgZm91bmRlZA&s=36rR.n9r",
            definition: "1625",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTYyNQ&s=tqmzFfEz&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTYyNQ&s=tqmzFfEz&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTYyNQ&s=tqmzFfEz&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/i/4waiy92X5ZNNbMiCglDfKQ_m.jpg",
            setId: 303628077,
            rank: 5,
            lastModified: 1530151306,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 19966980,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646887,
            word: "Mayflower's historic trip",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TWF5Zmxvd2VyJ3MgaGlzdG9yaWMgdHJpcA&s=XtdNrgmc",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWF5Zmxvd2VyJ3MgaGlzdG9yaWMgdHJpcA&s=XtdNrgmc&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TWF5Zmxvd2VyJ3MgaGlzdG9yaWMgdHJpcA&s=XtdNrgmc",
            definition: "1615",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTYxNQ&s=CWoIUKRo&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTYxNQ&s=CWoIUKRo&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTYxNQ&s=CWoIUKRo&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/H.iNqnO161c7-gTpUX7lhg_m.jpg",
            setId: 303628077,
            rank: 4,
            lastModified: 1530148547,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 16757666,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646885,
            word: "Founding of Roanoke Colony (the 'Lost Colony')",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Rm91bmRpbmcgb2YgUm9hbm9rZSBDb2xvbnkgKHRoZSAnTG9zdCBDb2xvbnknKQ&s=rrxlmrNl",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Rm91bmRpbmcgb2YgUm9hbm9rZSBDb2xvbnkgKHRoZSAnTG9zdCBDb2xvbnknKQ&s=rrxlmrNl&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Rm91bmRpbmcgb2YgUm9hbm9rZSBDb2xvbnkgKHRoZSAnTG9zdCBDb2xvbnknKQ&s=rrxlmrNl",
            definition: "1585",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTU4NQ&s=RbRMVqO5&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTU4NQ&s=RbRMVqO5&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTU4NQ&s=RbRMVqO5&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/oI.kvPQkGLmJOwXxp21bwQ_m.png",
            setId: 303628077,
            rank: 2,
            lastModified: 1530148547,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 13424741,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646884,
            word: "First slave in North America",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Rmlyc3Qgc2xhdmUgaW4gTm9ydGggQW1lcmljYQ&s=aSa1xPmX",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Rmlyc3Qgc2xhdmUgaW4gTm9ydGggQW1lcmljYQ&s=aSa1xPmX&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Rmlyc3Qgc2xhdmUgaW4gTm9ydGggQW1lcmljYQ&s=aSa1xPmX",
            definition: "1510",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTUxMA&s=KjMi08-M&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTUxMA&s=KjMi08-M&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTUxMA&s=KjMi08-M&sublanguage=math",
            _imageUrl:
              "https://farm9.staticflickr.com/8199/8187763543_57428a2fa0_m.jpg",
            setId: 303628077,
            rank: 1,
            lastModified: 1530148547,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 10920186,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 10295646883,
            word: "Discovery of America",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RGlzY292ZXJ5IG9mIEFtZXJpY2E&s=KxqzkOlW",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGlzY292ZXJ5IG9mIEFtZXJpY2E&s=KxqzkOlW&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RGlzY292ZXJ5IG9mIEFtZXJpY2E&s=KxqzkOlW",
            definition: "1492",
            _definitionTtsUrl:
              "/tts/en.mp3?v=15&b=MTQ5Mg&s=epRBQzox&sublanguage=math",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=15&b=MTQ5Mg&s=epRBQzox&sublanguage=math&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=15&b=MTQ5Mg&s=epRBQzox&sublanguage=math",
            _imageUrl: "https://o.quizlet.com/lkiuP1q9-XN49W7Ph1p1zg_m.jpg",
            setId: 303628077,
            rank: 0,
            lastModified: 1530148547,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: 20497529,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
        ],
      },
      paging: {
        total: 110,
        page: 1,
        perPage: 200,
        token: "qGksPNjPkB.Cm5detcbEUSNJRBnW",
      },
    },
  ],
};

downloaded[
  "https://quizlet.com/webapi/3.1/terms?filters[isDeleted]=0&filters[setId]=510003724"
] = {
  responses: [
    {
      models: {
        term: [
          {
            id: 18190051969,
            word: "Is that really what my hair looks like from the back?",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SXMgdGhhdCByZWFsbHkgd2hhdCBteSBoYWlyIGxvb2tzIGxpa2UgZnJvbSB0aGUgYmFjaz8&s=4PjOVEJO",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SXMgdGhhdCByZWFsbHkgd2hhdCBteSBoYWlyIGxvb2tzIGxpa2UgZnJvbSB0aGUgYmFjaz8&s=4PjOVEJO&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SXMgdGhhdCByZWFsbHkgd2hhdCBteSBoYWlyIGxvb2tzIGxpa2UgZnJvbSB0aGUgYmFjaz8&s=4PjOVEJO",
            definition: "June 1994\u200f\u200f\u200e \u200e",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAxOTk04oCP4oCP4oCOIOKAjg&s=tm2GUvp.",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAxOTk04oCP4oCP4oCOIOKAjg&s=tm2GUvp.&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAxOTk04oCP4oCP4oCOIOKAjg&s=tm2GUvp.",
            _imageUrl: null,
            setId: 510003724,
            rank: 63,
            lastModified: 1590974403,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18190317306,
            word: "How dare you stand where he stood.",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SG93IGRhcmUgeW91IHN0YW5kIHdoZXJlIGhlIHN0b29kLg&s=IAH9tU1S",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SG93IGRhcmUgeW91IHN0YW5kIHdoZXJlIGhlIHN0b29kLg&s=IAH9tU1S&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SG93IGRhcmUgeW91IHN0YW5kIHdoZXJlIGhlIHN0b29kLg&s=IAH9tU1S",
            definition: "May 1 1998\u200f\u200f\u200e \u200e",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=TWF5IDEgMTk5OOKAj-KAj-KAjiDigI4&s=3NDjeOhk",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWF5IDEgMTk5OOKAj-KAj-KAjiDigI4&s=3NDjeOhk&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=TWF5IDEgMTk5OOKAj-KAj-KAjiDigI4&s=3NDjeOhk",
            _imageUrl: null,
            setId: 510003724,
            rank: 96,
            lastModified: 1590955919,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18190261582,
            word: "Tell me Grindelwald, tell me where it is, tell me who possesses it!",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGVsbCBtZSBHcmluZGVsd2FsZCwgdGVsbCBtZSB3aGVyZSBpdCBpcywgdGVsbCBtZSB3aG8gcG9zc2Vzc2VzIGl0IQ&s=LlS-dcId",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGVsbCBtZSBHcmluZGVsd2FsZCwgdGVsbCBtZSB3aGVyZSBpdCBpcywgdGVsbCBtZSB3aG8gcG9zc2Vzc2VzIGl0IQ&s=LlS-dcId&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGVsbCBtZSBHcmluZGVsd2FsZCwgdGVsbCBtZSB3aGVyZSBpdCBpcywgdGVsbCBtZSB3aG8gcG9zc2Vzc2VzIGl0IQ&s=LlS-dcId",
            definition: "March 1998\u200f\u200f\u200e \u200e",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=TWFyY2ggMTk5OOKAj-KAj-KAjiDigI4&s=5V9aCcrp",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWFyY2ggMTk5OOKAj-KAj-KAjiDigI4&s=5V9aCcrp&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=TWFyY2ggMTk5OOKAj-KAj-KAjiDigI4&s=5V9aCcrp",
            _imageUrl: null,
            setId: 510003724,
            rank: 94,
            lastModified: 1590955269,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18190231064,
            word: "Please... don't think badly of me when you see it. You've no idea how he was like, even then...",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=UGxlYXNlLi4uIGRvbid0IHRoaW5rIGJhZGx5IG9mIG1lIHdoZW4geW91IHNlZSBpdC4gWW91J3ZlIG5vIGlkZWEgaG93IGhlIHdhcyBsaWtlLCBldmVuIHRoZW4uLi4&s=9AtZN41B",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=UGxlYXNlLi4uIGRvbid0IHRoaW5rIGJhZGx5IG9mIG1lIHdoZW4geW91IHNlZSBpdC4gWW91J3ZlIG5vIGlkZWEgaG93IGhlIHdhcyBsaWtlLCBldmVuIHRoZW4uLi4&s=9AtZN41B&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=UGxlYXNlLi4uIGRvbid0IHRoaW5rIGJhZGx5IG9mIG1lIHdoZW4geW91IHNlZSBpdC4gWW91J3ZlIG5vIGlkZWEgaG93IGhlIHdhcyBsaWtlLCBldmVuIHRoZW4uLi4&s=9AtZN41B",
            definition: "Spring 1997",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=U3ByaW5nIDE5OTc&s=b8COW3ua",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U3ByaW5nIDE5OTc&s=b8COW3ua&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=U3ByaW5nIDE5OTc&s=b8COW3ua",
            _imageUrl: null,
            setId: 510003724,
            rank: 88,
            lastModified: 1590955178,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185878188,
            word: "Don't you understand? I have to do this. I have to kill you... or he's gonna kill me.",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RG9uJ3QgeW91IHVuZGVyc3RhbmQ.IEkgaGF2ZSB0byBkbyB0aGlzLiBJIGhhdmUgdG8ga2lsbCB5b3UuLi4gb3IgaGUncyBnb25uYSBraWxsIG1lLg&s=uHVfSMML",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RG9uJ3QgeW91IHVuZGVyc3RhbmQ.IEkgaGF2ZSB0byBkbyB0aGlzLiBJIGhhdmUgdG8ga2lsbCB5b3UuLi4gb3IgaGUncyBnb25uYSBraWxsIG1lLg&s=uHVfSMML&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RG9uJ3QgeW91IHVuZGVyc3RhbmQ.IEkgaGF2ZSB0byBkbyB0aGlzLiBJIGhhdmUgdG8ga2lsbCB5b3UuLi4gb3IgaGUncyBnb25uYSBraWxsIG1lLg&s=uHVfSMML",
            definition: "June 30 1997\u200f\u200f\u200e \u200e",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAzMCAxOTk34oCP4oCP4oCOIOKAjg&s=Qys4ociD",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAzMCAxOTk34oCP4oCP4oCOIOKAjg&s=Qys4ociD&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAzMCAxOTk34oCP4oCP4oCOIOKAjg&s=Qys4ociD",
            _imageUrl: null,
            setId: 510003724,
            rank: 91,
            lastModified: 1590955027,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185869101,
            word: "Dementors in Little Winging! Whatever next? The whole world's gone topsy-turvy!",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RGVtZW50b3JzIGluIExpdHRsZSBXaW5naW5nISBXaGF0ZXZlciBuZXh0PyBUaGUgd2hvbGUgd29ybGQncyBnb25lIHRvcHN5LXR1cnZ5IQ&s=rE5OPtBL",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVtZW50b3JzIGluIExpdHRsZSBXaW5naW5nISBXaGF0ZXZlciBuZXh0PyBUaGUgd2hvbGUgd29ybGQncyBnb25lIHRvcHN5LXR1cnZ5IQ&s=rE5OPtBL&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RGVtZW50b3JzIGluIExpdHRsZSBXaW5naW5nISBXaGF0ZXZlciBuZXh0PyBUaGUgd2hvbGUgd29ybGQncyBnb25lIHRvcHN5LXR1cnZ5IQ&s=rE5OPtBL",
            definition: "August 2 1995",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDIgMTk5NQ&s=k9mDYW2B",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDIgMTk5NQ&s=k9mDYW2B&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDIgMTk5NQ&s=k9mDYW2B",
            _imageUrl: null,
            setId: 510003724,
            rank: 76,
            lastModified: 1590954809,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18190217785,
            word: "You have been told that a certain dark wizard is at large once again. This is a lie.",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=WW91IGhhdmUgYmVlbiB0b2xkIHRoYXQgYSBjZXJ0YWluIGRhcmsgd2l6YXJkIGlzIGF0IGxhcmdlIG9uY2UgYWdhaW4uIFRoaXMgaXMgYSBsaWUu&s=0WCYkKcd",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=WW91IGhhdmUgYmVlbiB0b2xkIHRoYXQgYSBjZXJ0YWluIGRhcmsgd2l6YXJkIGlzIGF0IGxhcmdlIG9uY2UgYWdhaW4uIFRoaXMgaXMgYSBsaWUu&s=0WCYkKcd&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=WW91IGhhdmUgYmVlbiB0b2xkIHRoYXQgYSBjZXJ0YWluIGRhcmsgd2l6YXJkIGlzIGF0IGxhcmdlIG9uY2UgYWdhaW4uIFRoaXMgaXMgYSBsaWUu&s=0WCYkKcd",
            definition: "September 2 1995",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDIgMTk5NQ&s=SmCOTySF",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDIgMTk5NQ&s=SmCOTySF&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDIgMTk5NQ&s=SmCOTySF",
            _imageUrl: null,
            setId: 510003724,
            rank: 77,
            lastModified: 1590954749,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185870526,
            word: '"I must not tell lies"',
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=IkkgbXVzdCBub3QgdGVsbCBsaWVzIg&s=1Wz3wvi9",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=IkkgbXVzdCBub3QgdGVsbCBsaWVzIg&s=1Wz3wvi9&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=IkkgbXVzdCBub3QgdGVsbCBsaWVzIg&s=1Wz3wvi9",
            definition: "September 3 1995",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDMgMTk5NQ&s=TpQ37j9A",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDMgMTk5NQ&s=TpQ37j9A&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDMgMTk5NQ&s=TpQ37j9A",
            _imageUrl: null,
            setId: 510003724,
            rank: 78,
            lastModified: 1590954749,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185866199,
            word: '"Harry, Take my body back...Take my body back to my father."',
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=IkhhcnJ5LCBUYWtlIG15IGJvZHkgYmFjay4uLlRha2UgbXkgYm9keSBiYWNrIHRvIG15IGZhdGhlci4i&s=3v0Ye-Wr",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=IkhhcnJ5LCBUYWtlIG15IGJvZHkgYmFjay4uLlRha2UgbXkgYm9keSBiYWNrIHRvIG15IGZhdGhlci4i&s=3v0Ye-Wr&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=IkhhcnJ5LCBUYWtlIG15IGJvZHkgYmFjay4uLlRha2UgbXkgYm9keSBiYWNrIHRvIG15IGZhdGhlci4i&s=3v0Ye-Wr",
            definition: "June 24 1995\u200f\u200f\u200e \u200e",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAyNCAxOTk14oCP4oCP4oCOIOKAjg&s=8n99aevN",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAyNCAxOTk14oCP4oCP4oCOIOKAjg&s=8n99aevN&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAyNCAxOTk14oCP4oCP4oCOIOKAjg&s=8n99aevN",
            _imageUrl: null,
            setId: 510003724,
            rank: 75,
            lastModified: 1590954647,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18190067428,
            word: "Turn to page 394.",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VHVybiB0byBwYWdlIDM5NC4&s=lhFvNtiN",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VHVybiB0byBwYWdlIDM5NC4&s=lhFvNtiN&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VHVybiB0byBwYWdlIDM5NC4&s=lhFvNtiN",
            definition: "January 1994",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=SmFudWFyeSAxOTk0&s=qUvxsuMd",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SmFudWFyeSAxOTk0&s=qUvxsuMd&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SmFudWFyeSAxOTk0&s=qUvxsuMd",
            _imageUrl: null,
            setId: 510003724,
            rank: 61,
            lastModified: 1590952778,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18190049806,
            word: "Search the *skies* if you must, Minister, but now I think I'll have a nice cup of tea, or a large brandy. Oh, and executioner, your services are no longer required. Thank you.",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U2VhcmNoIHRoZSAqc2tpZXMqIGlmIHlvdSBtdXN0LCBNaW5pc3RlciwgYnV0IG5vdyBJIHRoaW5rIEknbGwgaGF2ZSBhIG5pY2UgY3VwIG9mIHRlYSwgb3IgYSBsYXJnZSBicmFuZHkuIE9oLCBhbmQgZXhlY3V0aW9uZXIsIHlvdXIgc2VydmljZXMgYXJlIG5vIGxvbmdlciByZXF1aXJlZC4gVGhhbmsgeW91Lg&s=h5tc6Nok",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2VhcmNoIHRoZSAqc2tpZXMqIGlmIHlvdSBtdXN0LCBNaW5pc3RlciwgYnV0IG5vdyBJIHRoaW5rIEknbGwgaGF2ZSBhIG5pY2UgY3VwIG9mIHRlYSwgb3IgYSBsYXJnZSBicmFuZHkuIE9oLCBhbmQgZXhlY3V0aW9uZXIsIHlvdXIgc2VydmljZXMgYXJlIG5vIGxvbmdlciByZXF1aXJlZC4gVGhhbmsgeW91Lg&s=h5tc6Nok&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U2VhcmNoIHRoZSAqc2tpZXMqIGlmIHlvdSBtdXN0LCBNaW5pc3RlciwgYnV0IG5vdyBJIHRoaW5rIEknbGwgaGF2ZSBhIG5pY2UgY3VwIG9mIHRlYSwgb3IgYSBsYXJnZSBicmFuZHkuIE9oLCBhbmQgZXhlY3V0aW9uZXIsIHlvdXIgc2VydmljZXMgYXJlIG5vIGxvbmdlciByZXF1aXJlZC4gVGhhbmsgeW91Lg&s=h5tc6Nok",
            definition: "June 1994",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=SnVuZSAxOTk0&s=fPiHyGyS",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAxOTk0&s=fPiHyGyS&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=SnVuZSAxOTk0&s=fPiHyGyS",
            _imageUrl: null,
            setId: 510003724,
            rank: 64,
            lastModified: 1590952559,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185576925,
            word: "You'll regret this! You and your bloody chicken!!!",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=WW91J2xsIHJlZ3JldCB0aGlzISBZb3UgYW5kIHlvdXIgYmxvb2R5IGNoaWNrZW4hISE&s=nzooU6Pl",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=WW91J2xsIHJlZ3JldCB0aGlzISBZb3UgYW5kIHlvdXIgYmxvb2R5IGNoaWNrZW4hISE&s=nzooU6Pl&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=WW91J2xsIHJlZ3JldCB0aGlzISBZb3UgYW5kIHlvdXIgYmxvb2R5IGNoaWNrZW4hISE&s=nzooU6Pl",
            definition: "September 2 1993",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDIgMTk5Mw&s=-FkYiRN7",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDIgMTk5Mw&s=-FkYiRN7&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDIgMTk5Mw&s=-FkYiRN7",
            _imageUrl: null,
            setId: 510003724,
            rank: 58,
            lastModified: 1590952522,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18190035588,
            word: "I'll be in my bedroom, making no noise and pretending that I don't exist",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SSdsbCBiZSBpbiBteSBiZWRyb29tLCBtYWtpbmcgbm8gbm9pc2UgYW5kIHByZXRlbmRpbmcgdGhhdCBJIGRvbid0IGV4aXN0&s=j5MHK4iC",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SSdsbCBiZSBpbiBteSBiZWRyb29tLCBtYWtpbmcgbm8gbm9pc2UgYW5kIHByZXRlbmRpbmcgdGhhdCBJIGRvbid0IGV4aXN0&s=j5MHK4iC&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SSdsbCBiZSBpbiBteSBiZWRyb29tLCBtYWtpbmcgbm8gbm9pc2UgYW5kIHByZXRlbmRpbmcgdGhhdCBJIGRvbid0IGV4aXN0&s=j5MHK4iC",
            definition: "July 31 1992",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=SnVseSAzMSAxOTky&s=uqRdmQto",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVseSAzMSAxOTky&s=uqRdmQto&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SnVseSAzMSAxOTky&s=uqRdmQto",
            _imageUrl: null,
            setId: 510003724,
            rank: 37,
            lastModified: 1590952405,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18190032252,
            word: "I didn't get rid of the Banden Banshee by smiling at him.",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SSBkaWRuJ3QgZ2V0IHJpZCBvZiB0aGUgQmFuZGVuIEJhbnNoZWUgYnkgc21pbGluZyBhdCBoaW0u&s=LfYpNz89",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SSBkaWRuJ3QgZ2V0IHJpZCBvZiB0aGUgQmFuZGVuIEJhbnNoZWUgYnkgc21pbGluZyBhdCBoaW0u&s=LfYpNz89&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SSBkaWRuJ3QgZ2V0IHJpZCBvZiB0aGUgQmFuZGVuIEJhbnNoZWUgYnkgc21pbGluZyBhdCBoaW0u&s=LfYpNz89",
            definition: "September 2 1992",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDIgMTk5Mg&s=IEZ2mVO0",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDIgMTk5Mg&s=IEZ2mVO0&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDIgMTk5Mg&s=IEZ2mVO0",
            _imageUrl: null,
            setId: 510003724,
            rank: 42,
            lastModified: 1590952320,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18190023429,
            word: "(To Tom Riddle's Diary) My name is Harry Potter.",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=KFRvIFRvbSBSaWRkbGUncyBEaWFyeSkgTXkgbmFtZSBpcyBIYXJyeSBQb3R0ZXIu&s=aa5tfZc.",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=KFRvIFRvbSBSaWRkbGUncyBEaWFyeSkgTXkgbmFtZSBpcyBIYXJyeSBQb3R0ZXIu&s=aa5tfZc.&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=KFRvIFRvbSBSaWRkbGUncyBEaWFyeSkgTXkgbmFtZSBpcyBIYXJyeSBQb3R0ZXIu&s=aa5tfZc.",
            definition: "February 14 1993",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=RmVicnVhcnkgMTQgMTk5Mw&s=gtKwaJNK",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RmVicnVhcnkgMTQgMTk5Mw&s=gtKwaJNK&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=RmVicnVhcnkgMTQgMTk5Mw&s=gtKwaJNK",
            _imageUrl: null,
            setId: 510003724,
            rank: 49,
            lastModified: 1590952261,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185574764,
            word: "Dobby has got a sock. Master threw it, and Dobby caught it. Dobby is free!",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RG9iYnkgaGFzIGdvdCBhIHNvY2suIE1hc3RlciB0aHJldyBpdCwgYW5kIERvYmJ5IGNhdWdodCBpdC4gRG9iYnkgaXMgZnJlZSE&s=BtKOSuQN",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RG9iYnkgaGFzIGdvdCBhIHNvY2suIE1hc3RlciB0aHJldyBpdCwgYW5kIERvYmJ5IGNhdWdodCBpdC4gRG9iYnkgaXMgZnJlZSE&s=BtKOSuQN&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RG9iYnkgaGFzIGdvdCBhIHNvY2suIE1hc3RlciB0aHJldyBpdCwgYW5kIERvYmJ5IGNhdWdodCBpdC4gRG9iYnkgaXMgZnJlZSE&s=BtKOSuQN",
            definition: "May 30 1993",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=TWF5IDMwIDE5OTM&s=N3bwAevR",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWF5IDMwIDE5OTM&s=N3bwAevR&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=TWF5IDMwIDE5OTM&s=N3bwAevR",
            _imageUrl: null,
            setId: 510003724,
            rank: 53,
            lastModified: 1590952171,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185573593,
            word: 'Spiders? Why spiders? Why couldn\'t it be "follow the butterflies?"',
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U3BpZGVycz8gV2h5IHNwaWRlcnM.IFdoeSBjb3VsZG4ndCBpdCBiZSAiZm9sbG93IHRoZSBidXR0ZXJmbGllcz8i&s=tT6gacm6",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U3BpZGVycz8gV2h5IHNwaWRlcnM.IFdoeSBjb3VsZG4ndCBpdCBiZSAiZm9sbG93IHRoZSBidXR0ZXJmbGllcz8i&s=tT6gacm6&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U3BpZGVycz8gV2h5IHNwaWRlcnM.IFdoeSBjb3VsZG4ndCBpdCBiZSAiZm9sbG93IHRoZSBidXR0ZXJmbGllcz8i&s=tT6gacm6",
            definition: "May 24 1993",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=TWF5IDI0IDE5OTM&s=gM2cZI6p",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWF5IDI0IDE5OTM&s=gM2cZI6p&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=TWF5IDI0IDE5OTM&s=gM2cZI6p",
            _imageUrl: null,
            setId: 510003724,
            rank: 52,
            lastModified: 1590952141,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18190016029,
            word: "(Sticks tongue out at Ron in Howler form)",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=KFN0aWNrcyB0b25ndWUgb3V0IGF0IFJvbiBpbiBIb3dsZXIgZm9ybSk&s=LRByL2qX",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=KFN0aWNrcyB0b25ndWUgb3V0IGF0IFJvbiBpbiBIb3dsZXIgZm9ybSk&s=LRByL2qX&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=KFN0aWNrcyB0b25ndWUgb3V0IGF0IFJvbiBpbiBIb3dsZXIgZm9ybSk&s=LRByL2qX",
            definition: "September 1992",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDE5OTI&s=k41Rg1HV",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDE5OTI&s=k41Rg1HV&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDE5OTI&s=k41Rg1HV",
            _imageUrl: null,
            setId: 510003724,
            rank: 41,
            lastModified: 1590952111,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18190013253,
            word: "What exactly is the function of a rubber duck?",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=V2hhdCBleGFjdGx5IGlzIHRoZSBmdW5jdGlvbiBvZiBhIHJ1YmJlciBkdWNrPw&s=3hLRkWq0",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=V2hhdCBleGFjdGx5IGlzIHRoZSBmdW5jdGlvbiBvZiBhIHJ1YmJlciBkdWNrPw&s=3hLRkWq0&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=V2hhdCBleGFjdGx5IGlzIHRoZSBmdW5jdGlvbiBvZiBhIHJ1YmJlciBkdWNrPw&s=3hLRkWq0",
            definition: "August 1992",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=QXVndXN0IDE5OTI&s=fhR.Oaoz",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDE5OTI&s=fhR.Oaoz&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDE5OTI&s=fhR.Oaoz",
            _imageUrl: null,
            setId: 510003724,
            rank: 38,
            lastModified: 1590952075,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18189999448,
            word: "No post on Sunday!",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Tm8gcG9zdCBvbiBTdW5kYXkh&s=op1arK5I",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Tm8gcG9zdCBvbiBTdW5kYXkh&s=op1arK5I&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Tm8gcG9zdCBvbiBTdW5kYXkh&s=op1arK5I",
            definition: "July 1991",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=SnVseSAxOTkx&s=O9jCUgxF",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVseSAxOTkx&s=O9jCUgxF&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=SnVseSAxOTkx&s=O9jCUgxF",
            _imageUrl: null,
            setId: 510003724,
            rank: 16,
            lastModified: 1590951936,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18189997238,
            word: "Some people might think you are... up to something...",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U29tZSBwZW9wbGUgbWlnaHQgdGhpbmsgeW91IGFyZS4uLiB1cCB0byBzb21ldGhpbmcuLi4&s=s3hNQ4qN",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U29tZSBwZW9wbGUgbWlnaHQgdGhpbmsgeW91IGFyZS4uLiB1cCB0byBzb21ldGhpbmcuLi4&s=s3hNQ4qN&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U29tZSBwZW9wbGUgbWlnaHQgdGhpbmsgeW91IGFyZS4uLiB1cCB0byBzb21ldGhpbmcuLi4&s=s3hNQ4qN",
            definition:
              "June 1992\u200f\u200f\u200e \u200e\u200f\u200f\u200e \u200e\u200f\u200f\u200e \u200e\u200f\u200f\u200e \u200e",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAxOTky4oCP4oCP4oCOIOKAjuKAj-KAj-KAjiDigI7igI.igI.igI4g4oCO4oCP4oCP4oCOIOKAjg&s=4HYpMuTV",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAxOTky4oCP4oCP4oCOIOKAjuKAj-KAj-KAjiDigI7igI.igI.igI4g4oCO4oCP4oCP4oCOIOKAjg&s=4HYpMuTV&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAxOTky4oCP4oCP4oCOIOKAjuKAj-KAj-KAjiDigI7igI.igI.igI4g4oCO4oCP4oCP4oCOIOKAjg&s=4HYpMuTV",
            _imageUrl: null,
            setId: 510003724,
            rank: 32,
            lastModified: 1590951908,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185554439,
            word: "TROLL! THERE'S A TROLL IN THE DUNGEON! Just thought you ought to know.",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VFJPTEwhIFRIRVJFJ1MgQSBUUk9MTCBJTiBUSEUgRFVOR0VPTiEgSnVzdCB0aG91Z2h0IHlvdSBvdWdodCB0byBrbm93Lg&s=OEPEY0W5",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VFJPTEwhIFRIRVJFJ1MgQSBUUk9MTCBJTiBUSEUgRFVOR0VPTiEgSnVzdCB0aG91Z2h0IHlvdSBvdWdodCB0byBrbm93Lg&s=OEPEY0W5&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VFJPTEwhIFRIRVJFJ1MgQSBUUk9MTCBJTiBUSEUgRFVOR0VPTiEgSnVzdCB0aG91Z2h0IHlvdSBvdWdodCB0byBrbm93Lg&s=OEPEY0W5",
            definition: "October 31 1991",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMSAxOTkx&s=teAj70Py",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMSAxOTkx&s=teAj70Py&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMSAxOTkx&s=teAj70Py",
            _imageUrl: null,
            setId: 510003724,
            rank: 25,
            lastModified: 1590951759,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185561085,
            word: "[Voldemort Side] KILL HIM!",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=W1ZvbGRlbW9ydCBTaWRlXSBLSUxMIEhJTSE&s=NI8-d5Dx",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=W1ZvbGRlbW9ydCBTaWRlXSBLSUxMIEhJTSE&s=NI8-d5Dx&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=W1ZvbGRlbW9ydCBTaWRlXSBLSUxMIEhJTSE&s=NI8-d5Dx",
            definition: "June 1992",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=SnVuZSAxOTky&s=UJwjEcfp",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAxOTky&s=UJwjEcfp&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=SnVuZSAxOTky&s=UJwjEcfp",
            _imageUrl: null,
            setId: 510003724,
            rank: 34,
            lastModified: 1590951738,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18189982873,
            word: "It's Levi-o-sa. Not Leviosa!",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SXQncyBMZXZpLW8tc2EuIE5vdCBMZXZpb3NhIQ&s=4wPcnohS",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SXQncyBMZXZpLW8tc2EuIE5vdCBMZXZpb3NhIQ&s=4wPcnohS&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SXQncyBMZXZpLW8tc2EuIE5vdCBMZXZpb3NhIQ&s=4wPcnohS",
            definition: "October 30 1991",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMCAxOTkx&s=M1M5.e4A",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMCAxOTkx&s=M1M5.e4A&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMCAxOTkx&s=M1M5.e4A",
            _imageUrl: null,
            setId: 510003724,
            rank: 24,
            lastModified: 1590951711,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18189980010,
            word: "You must be a Weasley.",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=WW91IG11c3QgYmUgYSBXZWFzbGV5Lg&s=CLSfbFoS",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=WW91IG11c3QgYmUgYSBXZWFzbGV5Lg&s=CLSfbFoS&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=WW91IG11c3QgYmUgYSBXZWFzbGV5Lg&s=CLSfbFoS",
            definition: "September 1st 1991\u200f\u200f\u200e \u200e",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDFzdCAxOTkx4oCP4oCP4oCOIOKAjg&s=0MWX3fSA",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDFzdCAxOTkx4oCP4oCP4oCOIOKAjg&s=0MWX3fSA&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDFzdCAxOTkx4oCP4oCP4oCOIOKAjg&s=0MWX3fSA",
            _imageUrl: null,
            setId: 510003724,
            rank: 20,
            lastModified: 1590951669,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185551029,
            word: "\"Now, if you two don't mind, I'm going to bed before either of you come up with another clever idea to get us killed or worse... expelled!\"",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Ik5vdywgaWYgeW91IHR3byBkb24ndCBtaW5kLCBJJ20gZ29pbmcgdG8gYmVkIGJlZm9yZSBlaXRoZXIgb2YgeW91IGNvbWUgdXAgd2l0aCBhbm90aGVyIGNsZXZlciBpZGVhIHRvIGdldCB1cyBraWxsZWQgb3Igd29yc2UuLi4gZXhwZWxsZWQhIg&s=1Z5qd.1-",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Ik5vdywgaWYgeW91IHR3byBkb24ndCBtaW5kLCBJJ20gZ29pbmcgdG8gYmVkIGJlZm9yZSBlaXRoZXIgb2YgeW91IGNvbWUgdXAgd2l0aCBhbm90aGVyIGNsZXZlciBpZGVhIHRvIGdldCB1cyBraWxsZWQgb3Igd29yc2UuLi4gZXhwZWxsZWQhIg&s=1Z5qd.1-&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Ik5vdywgaWYgeW91IHR3byBkb24ndCBtaW5kLCBJJ20gZ29pbmcgdG8gYmVkIGJlZm9yZSBlaXRoZXIgb2YgeW91IGNvbWUgdXAgd2l0aCBhbm90aGVyIGNsZXZlciBpZGVhIHRvIGdldCB1cyBraWxsZWQgb3Igd29yc2UuLi4gZXhwZWxsZWQhIg&s=1Z5qd.1-",
            definition: "September 12 1991\u200f\u200f\u200e \u200e",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDEyIDE5OTHigI.igI.igI4g4oCO&s=kvxozrcp",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDEyIDE5OTHigI.igI.igI4g4oCO&s=kvxozrcp&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDEyIDE5OTHigI.igI.igI4g4oCO&s=kvxozrcp",
            _imageUrl: null,
            setId: 510003724,
            rank: 22,
            lastModified: 1590951643,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18189974938,
            word: "He's going to sacrifice himself!",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGUncyBnb2luZyB0byBzYWNyaWZpY2UgaGltc2VsZiE&s=5Sacez1i",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGUncyBnb2luZyB0byBzYWNyaWZpY2UgaGltc2VsZiE&s=5Sacez1i&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGUncyBnb2luZyB0byBzYWNyaWZpY2UgaGltc2VsZiE&s=5Sacez1i",
            definition:
              "June 1992\u200f\u200f\u200e \u200e\u200f\u200f\u200e \u200e\u200f\u200f\u200e \u200e",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAxOTky4oCP4oCP4oCOIOKAjuKAj-KAj-KAjiDigI7igI.igI.igI4g4oCO&s=J0VA8o5V",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAxOTky4oCP4oCP4oCOIOKAjuKAj-KAj-KAjiDigI7igI.igI.igI4g4oCO&s=J0VA8o5V&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAxOTky4oCP4oCP4oCOIOKAjuKAj-KAj-KAjiDigI7igI.igI.igI4g4oCO&s=J0VA8o5V",
            _imageUrl: null,
            setId: 510003724,
            rank: 33,
            lastModified: 1590951602,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18189968981,
            word: '"Yer a wizard, Harry."',
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=IlllciBhIHdpemFyZCwgSGFycnkuIg&s=L7dAAUm7",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=IlllciBhIHdpemFyZCwgSGFycnkuIg&s=L7dAAUm7&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=IlllciBhIHdpemFyZCwgSGFycnkuIg&s=L7dAAUm7",
            definition: "July 31 1991\u200f\u200f\u200e \u200e",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=SnVseSAzMSAxOTkx4oCP4oCP4oCOIOKAjg&s=MlMnk46p",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVseSAzMSAxOTkx4oCP4oCP4oCOIOKAjg&s=MlMnk46p&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SnVseSAzMSAxOTkx4oCP4oCP4oCOIOKAjg&s=MlMnk46p",
            _imageUrl: null,
            setId: 510003724,
            rank: 17,
            lastModified: 1590951526,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185888059,
            word: '"Always"',
            _wordTtsUrl: "/tts/en.mp3?v=14&b=IkFsd2F5cyI&s=Sz3.verc",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=IkFsd2F5cyI&s=Sz3.verc&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=IkFsd2F5cyI&s=Sz3.verc",
            definition: "May 1 1998",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=TWF5IDEgMTk5OA&s=aMd0F.gc",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWF5IDEgMTk5OA&s=aMd0F.gc&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=TWF5IDEgMTk5OA&s=aMd0F.gc",
            _imageUrl: null,
            setId: 510003724,
            rank: 97,
            lastModified: 1590951213,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185891674,
            word: "Nagini dies",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=TmFnaW5pIGRpZXM&s=dryzbfXa",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TmFnaW5pIGRpZXM&s=dryzbfXa&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=TmFnaW5pIGRpZXM&s=dryzbfXa",
            definition: "May 2 1998\u200f\u200f\u200e \u200e",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=TWF5IDIgMTk5OOKAj-KAj-KAjiDigI4&s=Veiy538O",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWF5IDIgMTk5OOKAj-KAj-KAjiDigI4&s=Veiy538O&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=TWF5IDIgMTk5OOKAj-KAj-KAjiDigI4&s=Veiy538O",
            _imageUrl: null,
            setId: 510003724,
            rank: 99,
            lastModified: 1590951193,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185891329,
            word: "Bellatrix Lestrange dies",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmVsbGF0cml4IExlc3RyYW5nZSBkaWVz&s=6ukCp0AF",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmVsbGF0cml4IExlc3RyYW5nZSBkaWVz&s=6ukCp0AF&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmVsbGF0cml4IExlc3RyYW5nZSBkaWVz&s=6ukCp0AF",
            definition:
              "May 2 1998\u200f\u200f\u200e \u200e\u200f\u200f\u200e \u200e",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=TWF5IDIgMTk5OOKAj-KAj-KAjiDigI7igI.igI.igI4g4oCO&s=Ta3eBMRj",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWF5IDIgMTk5OOKAj-KAj-KAjiDigI7igI.igI.igI4g4oCO&s=Ta3eBMRj&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=TWF5IDIgMTk5OOKAj-KAj-KAjiDigI7igI.igI.igI4g4oCO&s=Ta3eBMRj",
            _imageUrl: null,
            setId: 510003724,
            rank: 98,
            lastModified: 1590951189,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185876809,
            word: "Draco brings Death Eaters into Hogwarts through a Vanishing Cabinet",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RHJhY28gYnJpbmdzIERlYXRoIEVhdGVycyBpbnRvIEhvZ3dhcnRzIHRocm91Z2ggYSBWYW5pc2hpbmcgQ2FiaW5ldA&s=mu9GmMc9",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RHJhY28gYnJpbmdzIERlYXRoIEVhdGVycyBpbnRvIEhvZ3dhcnRzIHRocm91Z2ggYSBWYW5pc2hpbmcgQ2FiaW5ldA&s=mu9GmMc9&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RHJhY28gYnJpbmdzIERlYXRoIEVhdGVycyBpbnRvIEhvZ3dhcnRzIHRocm91Z2ggYSBWYW5pc2hpbmcgQ2FiaW5ldA&s=mu9GmMc9",
            definition:
              "June 30 1997\u200f\u200f\u200e \u200e\u200f\u200f\u200e \u200e",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAzMCAxOTk34oCP4oCP4oCOIOKAjuKAj-KAj-KAjiDigI4&s=NL0HgKFG",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAzMCAxOTk34oCP4oCP4oCOIOKAjuKAj-KAj-KAjiDigI4&s=NL0HgKFG&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAzMCAxOTk34oCP4oCP4oCOIOKAjuKAj-KAj-KAjiDigI4&s=NL0HgKFG",
            _imageUrl: null,
            setId: 510003724,
            rank: 90,
            lastModified: 1590951163,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185574183,
            word: "Hagrid is sent to Azkaban",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFncmlkIGlzIHNlbnQgdG8gQXprYWJhbg&s=Wlb4gaX8",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFncmlkIGlzIHNlbnQgdG8gQXprYWJhbg&s=Wlb4gaX8&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFncmlkIGlzIHNlbnQgdG8gQXprYWJhbg&s=Wlb4gaX8",
            definition: "May 8 1993\u200f\u200f\u200e \u200e",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=TWF5IDggMTk5M-KAj-KAj-KAjiDigI4&s=lIU-Wo5Z",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWF5IDggMTk5M-KAj-KAj-KAjiDigI4&s=lIU-Wo5Z&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=TWF5IDggMTk5M-KAj-KAj-KAjiDigI4&s=lIU-Wo5Z",
            _imageUrl: null,
            setId: 510003724,
            rank: 51,
            lastModified: 1590950886,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185973900,
            word: '"It takes a great deal of bravery to stand up to our enemies, but just as much to stand up to our friends."',
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Ikl0IHRha2VzIGEgZ3JlYXQgZGVhbCBvZiBicmF2ZXJ5IHRvIHN0YW5kIHVwIHRvIG91ciBlbmVtaWVzLCBidXQganVzdCBhcyBtdWNoIHRvIHN0YW5kIHVwIHRvIG91ciBmcmllbmRzLiI&s=DShBz76w",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Ikl0IHRha2VzIGEgZ3JlYXQgZGVhbCBvZiBicmF2ZXJ5IHRvIHN0YW5kIHVwIHRvIG91ciBlbmVtaWVzLCBidXQganVzdCBhcyBtdWNoIHRvIHN0YW5kIHVwIHRvIG91ciBmcmllbmRzLiI&s=DShBz76w&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Ikl0IHRha2VzIGEgZ3JlYXQgZGVhbCBvZiBicmF2ZXJ5IHRvIHN0YW5kIHVwIHRvIG91ciBlbmVtaWVzLCBidXQganVzdCBhcyBtdWNoIHRvIHN0YW5kIHVwIHRvIG91ciBmcmllbmRzLiI&s=DShBz76w",
            definition:
              "June 1992\u200f\u200f\u200e \u200e\u200f\u200f\u200e \u200e",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAxOTky4oCP4oCP4oCOIOKAjuKAj-KAj-KAjiDigI4&s=4nYK9Pet",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAxOTky4oCP4oCP4oCOIOKAjuKAj-KAj-KAjiDigI4&s=4nYK9Pet&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAxOTky4oCP4oCP4oCOIOKAjuKAj-KAj-KAjiDigI4&s=4nYK9Pet",
            _imageUrl: null,
            setId: 510003724,
            rank: 36,
            lastModified: 1590950751,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185561086,
            word: '"To the well-organized mind, death is but the next great adventure."',
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=IlRvIHRoZSB3ZWxsLW9yZ2FuaXplZCBtaW5kLCBkZWF0aCBpcyBidXQgdGhlIG5leHQgZ3JlYXQgYWR2ZW50dXJlLiI&s=kJirh8V7",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=IlRvIHRoZSB3ZWxsLW9yZ2FuaXplZCBtaW5kLCBkZWF0aCBpcyBidXQgdGhlIG5leHQgZ3JlYXQgYWR2ZW50dXJlLiI&s=kJirh8V7&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=IlRvIHRoZSB3ZWxsLW9yZ2FuaXplZCBtaW5kLCBkZWF0aCBpcyBidXQgdGhlIG5leHQgZ3JlYXQgYWR2ZW50dXJlLiI&s=kJirh8V7",
            definition: "June 1992\u200f\u200f\u200e \u200e",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAxOTky4oCP4oCP4oCOIOKAjg&s=zvgQoSYg",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAxOTky4oCP4oCP4oCOIOKAjg&s=zvgQoSYg&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAxOTky4oCP4oCP4oCOIOKAjg&s=zvgQoSYg",
            _imageUrl: null,
            setId: 510003724,
            rank: 35,
            lastModified: 1590950745,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185556778,
            word: '"It does not do to dwell on dreams and forget to live."',
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Ikl0IGRvZXMgbm90IGRvIHRvIGR3ZWxsIG9uIGRyZWFtcyBhbmQgZm9yZ2V0IHRvIGxpdmUuIg&s=dF2zwNOR",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Ikl0IGRvZXMgbm90IGRvIHRvIGR3ZWxsIG9uIGRyZWFtcyBhbmQgZm9yZ2V0IHRvIGxpdmUuIg&s=dF2zwNOR&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Ikl0IGRvZXMgbm90IGRvIHRvIGR3ZWxsIG9uIGRyZWFtcyBhbmQgZm9yZ2V0IHRvIGxpdmUuIg&s=dF2zwNOR",
            definition:
              "December 25 1991\u200f\u200f\u200e \u200e\u200f\u200f\u200e \u200e",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMjUgMTk5MeKAj-KAj-KAjiDigI7igI.igI.igI4g4oCO&s=yzwCEMqU",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMjUgMTk5MeKAj-KAj-KAjiDigI7igI.igI.igI4g4oCO&s=yzwCEMqU&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMjUgMTk5MeKAj-KAj-KAjiDigI7igI.igI.igI4g4oCO&s=yzwCEMqU",
            _imageUrl: null,
            setId: 510003724,
            rank: 29,
            lastModified: 1590950729,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185556545,
            word: "Harry visits the restricted section of the library",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgdmlzaXRzIHRoZSByZXN0cmljdGVkIHNlY3Rpb24gb2YgdGhlIGxpYnJhcnk&s=d-ZJnXBl",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgdmlzaXRzIHRoZSByZXN0cmljdGVkIHNlY3Rpb24gb2YgdGhlIGxpYnJhcnk&s=d-ZJnXBl&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgdmlzaXRzIHRoZSByZXN0cmljdGVkIHNlY3Rpb24gb2YgdGhlIGxpYnJhcnk&s=d-ZJnXBl",
            definition: "December 25 1991\u200f\u200f\u200e \u200e",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMjUgMTk5MeKAj-KAj-KAjiDigI4&s=8sD.dYCW",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMjUgMTk5MeKAj-KAj-KAjiDigI4&s=8sD.dYCW&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMjUgMTk5MeKAj-KAj-KAjiDigI4&s=8sD.dYCW",
            _imageUrl: null,
            setId: 510003724,
            rank: 28,
            lastModified: 1590950726,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185531547,
            word: "James Potter dies",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SmFtZXMgUG90dGVyIGRpZXM&s=1zZw4NpY",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SmFtZXMgUG90dGVyIGRpZXM&s=1zZw4NpY&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SmFtZXMgUG90dGVyIGRpZXM&s=1zZw4NpY",
            definition: "October 31 1981\u200f\u200f\u200e \u200e",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMSAxOTgx4oCP4oCP4oCOIOKAjg&s=5x9wHS7p",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMSAxOTgx4oCP4oCP4oCOIOKAjg&s=5x9wHS7p&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMSAxOTgx4oCP4oCP4oCOIOKAjg&s=5x9wHS7p",
            _imageUrl: null,
            setId: 510003724,
            rank: 14,
            lastModified: 1590950679,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185986774,
            word: '"If you want to know what a man\'s like, take a good look at how he treats his inferiors, not his equals."',
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=IklmIHlvdSB3YW50IHRvIGtub3cgd2hhdCBhIG1hbidzIGxpa2UsIHRha2UgYSBnb29kIGxvb2sgYXQgaG93IGhlIHRyZWF0cyBoaXMgaW5mZXJpb3JzLCBub3QgaGlzIGVxdWFscy4i&s=AA5ZMb37",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=IklmIHlvdSB3YW50IHRvIGtub3cgd2hhdCBhIG1hbidzIGxpa2UsIHRha2UgYSBnb29kIGxvb2sgYXQgaG93IGhlIHRyZWF0cyBoaXMgaW5mZXJpb3JzLCBub3QgaGlzIGVxdWFscy4i&s=AA5ZMb37&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=IklmIHlvdSB3YW50IHRvIGtub3cgd2hhdCBhIG1hbidzIGxpa2UsIHRha2UgYSBnb29kIGxvb2sgYXQgaG93IGhlIHRyZWF0cyBoaXMgaW5mZXJpb3JzLCBub3QgaGlzIGVxdWFscy4i&s=AA5ZMb37",
            definition: "~April 1995",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=fkFwcmlsIDE5OTU&s=d8OnBM1B",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=fkFwcmlsIDE5OTU&s=d8OnBM1B&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=fkFwcmlsIDE5OTU&s=d8OnBM1B",
            _imageUrl: null,
            setId: 510003724,
            rank: 72,
            lastModified: 1590890214,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185892453,
            word: '"Do not pity the dead, Harry. Pity the living, and, above all those who live without love."',
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=IkRvIG5vdCBwaXR5IHRoZSBkZWFkLCBIYXJyeS4gUGl0eSB0aGUgbGl2aW5nLCBhbmQsIGFib3ZlIGFsbCB0aG9zZSB3aG8gbGl2ZSB3aXRob3V0IGxvdmUuIg&s=frYi4-sM",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=IkRvIG5vdCBwaXR5IHRoZSBkZWFkLCBIYXJyeS4gUGl0eSB0aGUgbGl2aW5nLCBhbmQsIGFib3ZlIGFsbCB0aG9zZSB3aG8gbGl2ZSB3aXRob3V0IGxvdmUuIg&s=frYi4-sM&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=IkRvIG5vdCBwaXR5IHRoZSBkZWFkLCBIYXJyeS4gUGl0eSB0aGUgbGl2aW5nLCBhbmQsIGFib3ZlIGFsbCB0aG9zZSB3aG8gbGl2ZSB3aXRob3V0IGxvdmUuIg&s=frYi4-sM",
            definition: "May 2 1998",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=TWF5IDIgMTk5OA&s=iuIdxBuQ",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWF5IDIgMTk5OA&s=iuIdxBuQ&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=TWF5IDIgMTk5OA&s=iuIdxBuQ",
            _imageUrl: null,
            setId: 510003724,
            rank: 100,
            lastModified: 1590889947,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185567948,
            word: "Scared, Potter?",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=U2NhcmVkLCBQb3R0ZXI.&s=HCwDMc8o",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2NhcmVkLCBQb3R0ZXI.&s=HCwDMc8o&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=U2NhcmVkLCBQb3R0ZXI.&s=HCwDMc8o",
            definition: "December 17 1992",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMTcgMTk5Mg&s=8feakOrQ",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMTcgMTk5Mg&s=8feakOrQ&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMTcgMTk5Mg&s=8feakOrQ",
            _imageUrl: null,
            setId: 510003724,
            rank: 47,
            lastModified: 1590888372,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185864296,
            word: "The Third Task",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=VGhlIFRoaXJkIFRhc2s&s=Bme3OCXm",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFRoaXJkIFRhc2s&s=Bme3OCXm&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=VGhlIFRoaXJkIFRhc2s&s=Bme3OCXm",
            definition: "June 24 1995",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=SnVuZSAyNCAxOTk1&s=gy22S4-n",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAyNCAxOTk1&s=gy22S4-n&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAyNCAxOTk1&s=gy22S4-n",
            _imageUrl: null,
            setId: 510003724,
            rank: 74,
            lastModified: 1590888289,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185533132,
            word: "Lily Potter dies",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=TGlseSBQb3R0ZXIgZGllcw&s=hmI3dlKA",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TGlseSBQb3R0ZXIgZGllcw&s=hmI3dlKA&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TGlseSBQb3R0ZXIgZGllcw&s=hmI3dlKA",
            definition: "October 31 1981",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMSAxOTgx&s=vjinVYsq",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMSAxOTgx&s=vjinVYsq&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMSAxOTgx&s=vjinVYsq",
            _imageUrl: null,
            setId: 510003724,
            rank: 15,
            lastModified: 1590888276,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185886271,
            word: "Dobby is killed",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=RG9iYnkgaXMga2lsbGVk&s=GWgtlzuT",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RG9iYnkgaXMga2lsbGVk&s=GWgtlzuT&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=RG9iYnkgaXMga2lsbGVk&s=GWgtlzuT",
            definition: "March 1998",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=TWFyY2ggMTk5OA&s=wkUQWQml",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWFyY2ggMTk5OA&s=wkUQWQml&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=TWFyY2ggMTk5OA&s=wkUQWQml",
            _imageUrl: null,
            setId: 510003724,
            rank: 95,
            lastModified: 1590887908,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185880779,
            word: "Bill and Fleur's Wedding",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmlsbCBhbmQgRmxldXIncyBXZWRkaW5n&s=8tj9k3EY",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmlsbCBhbmQgRmxldXIncyBXZWRkaW5n&s=8tj9k3EY&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmlsbCBhbmQgRmxldXIncyBXZWRkaW5n&s=8tj9k3EY",
            definition: "August 1 1997",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDEgMTk5Nw&s=P1oINGPX",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDEgMTk5Nw&s=P1oINGPX&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDEgMTk5Nw&s=P1oINGPX",
            _imageUrl: null,
            setId: 510003724,
            rank: 93,
            lastModified: 1590887777,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185879949,
            word: "Battle of the Seven Potters",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QmF0dGxlIG9mIHRoZSBTZXZlbiBQb3R0ZXJz&s=I01xHsZh",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QmF0dGxlIG9mIHRoZSBTZXZlbiBQb3R0ZXJz&s=I01xHsZh&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QmF0dGxlIG9mIHRoZSBTZXZlbiBQb3R0ZXJz&s=I01xHsZh",
            definition: "July 27 1997",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=SnVseSAyNyAxOTk3&s=jLCzfwPR",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVseSAyNyAxOTk3&s=jLCzfwPR&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SnVseSAyNyAxOTk3&s=jLCzfwPR",
            _imageUrl: null,
            setId: 510003724,
            rank: 92,
            lastModified: 1590887754,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185876366,
            word: "Harry and Dumbledore visit Voldemort's sea cave",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgYW5kIER1bWJsZWRvcmUgdmlzaXQgVm9sZGVtb3J0J3Mgc2VhIGNhdmU&s=Mp7X3HT-",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgYW5kIER1bWJsZWRvcmUgdmlzaXQgVm9sZGVtb3J0J3Mgc2VhIGNhdmU&s=Mp7X3HT-&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgYW5kIER1bWJsZWRvcmUgdmlzaXQgVm9sZGVtb3J0J3Mgc2VhIGNhdmU&s=Mp7X3HT-",
            definition: "June 30 1997",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=SnVuZSAzMCAxOTk3&s=HGiG0.4D",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAzMCAxOTk3&s=HGiG0.4D&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAzMCAxOTk3&s=HGiG0.4D",
            _imageUrl: null,
            setId: 510003724,
            rank: 89,
            lastModified: 1590887679,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185874913,
            word: "Fudge resigns",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=RnVkZ2UgcmVzaWducw&s=vbsWFWpm",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RnVkZ2UgcmVzaWducw&s=vbsWFWpm&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=RnVkZ2UgcmVzaWducw&s=vbsWFWpm",
            definition: "July 1 1996",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=SnVseSAxIDE5OTY&s=XpMvqXCO",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVseSAxIDE5OTY&s=XpMvqXCO&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SnVseSAxIDE5OTY&s=XpMvqXCO",
            _imageUrl: null,
            setId: 510003724,
            rank: 87,
            lastModified: 1590887636,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185874591,
            word: "The Battle of the Department of Mysteries",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEJhdHRsZSBvZiB0aGUgRGVwYXJ0bWVudCBvZiBNeXN0ZXJpZXM&s=y2G9ysxu",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEJhdHRsZSBvZiB0aGUgRGVwYXJ0bWVudCBvZiBNeXN0ZXJpZXM&s=y2G9ysxu&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VGhlIEJhdHRsZSBvZiB0aGUgRGVwYXJ0bWVudCBvZiBNeXN0ZXJpZXM&s=y2G9ysxu",
            definition: "June 20 1996",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=SnVuZSAyMCAxOTk2&s=E9HNhVpN",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAyMCAxOTk2&s=E9HNhVpN&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAyMCAxOTk2&s=E9HNhVpN",
            _imageUrl: null,
            setId: 510003724,
            rank: 86,
            lastModified: 1590887624,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185873931,
            word: "Weasley's Wizard Wheezes opens",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=V2Vhc2xleSdzIFdpemFyZCBXaGVlemVzIG9wZW5z&s=wv-oFk6B",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=V2Vhc2xleSdzIFdpemFyZCBXaGVlemVzIG9wZW5z&s=wv-oFk6B&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=V2Vhc2xleSdzIFdpemFyZCBXaGVlemVzIG9wZW5z&s=wv-oFk6B",
            definition: "April 16 1996",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=QXByaWwgMTYgMTk5Ng&s=lBKZyLdF",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QXByaWwgMTYgMTk5Ng&s=lBKZyLdF&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=QXByaWwgMTYgMTk5Ng&s=lBKZyLdF",
            _imageUrl: null,
            setId: 510003724,
            rank: 85,
            lastModified: 1590887602,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185873123,
            word: "Umbridge becomes Headmistress",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VW1icmlkZ2UgYmVjb21lcyBIZWFkbWlzdHJlc3M&s=QCmpxTO8",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VW1icmlkZ2UgYmVjb21lcyBIZWFkbWlzdHJlc3M&s=QCmpxTO8&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VW1icmlkZ2UgYmVjb21lcyBIZWFkbWlzdHJlc3M&s=QCmpxTO8",
            definition: "April 2 1996",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=QXByaWwgMiAxOTk2&s=0fqcH6Ju",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QXByaWwgMiAxOTk2&s=0fqcH6Ju&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=QXByaWwgMiAxOTk2&s=0fqcH6Ju",
            _imageUrl: null,
            setId: 510003724,
            rank: 84,
            lastModified: 1590887584,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185872743,
            word: "Harry begins Occlumency lessons with Snape",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgYmVnaW5zIE9jY2x1bWVuY3kgbGVzc29ucyB3aXRoIFNuYXBl&s=2m2OVZi0",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgYmVnaW5zIE9jY2x1bWVuY3kgbGVzc29ucyB3aXRoIFNuYXBl&s=2m2OVZi0&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgYmVnaW5zIE9jY2x1bWVuY3kgbGVzc29ucyB3aXRoIFNuYXBl&s=2m2OVZi0",
            definition: "January 13 1996",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=SmFudWFyeSAxMyAxOTk2&s=KPHvVvM-",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SmFudWFyeSAxMyAxOTk2&s=KPHvVvM-&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SmFudWFyeSAxMyAxOTk2&s=KPHvVvM-",
            _imageUrl: null,
            setId: 510003724,
            rank: 83,
            lastModified: 1590887584,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185872460,
            word: "Mr. Weasley is attacked by Nagini",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TXIuIFdlYXNsZXkgaXMgYXR0YWNrZWQgYnkgTmFnaW5p&s=LWQmZPRd",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TXIuIFdlYXNsZXkgaXMgYXR0YWNrZWQgYnkgTmFnaW5p&s=LWQmZPRd&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TXIuIFdlYXNsZXkgaXMgYXR0YWNrZWQgYnkgTmFnaW5p&s=LWQmZPRd",
            definition: "December 18 1995",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMTggMTk5NQ&s=IPxn24tC",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMTggMTk5NQ&s=IPxn24tC&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMTggMTk5NQ&s=IPxn24tC",
            _imageUrl: null,
            setId: 510003724,
            rank: 82,
            lastModified: 1590887571,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185872459,
            word: "Harry's first kiss",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkncyBmaXJzdCBraXNz&s=LsBh.q1-",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkncyBmaXJzdCBraXNz&s=LsBh.q1-&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFycnkncyBmaXJzdCBraXNz&s=LsBh.q1-",
            definition: "December 18 1995",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMTggMTk5NQ&s=IPxn24tC",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMTggMTk5NQ&s=IPxn24tC&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMTggMTk5NQ&s=IPxn24tC",
            _imageUrl: null,
            setId: 510003724,
            rank: 81,
            lastModified: 1590887559,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185871493,
            word: '"Weasley is Our King"',
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=IldlYXNsZXkgaXMgT3VyIEtpbmci&s=06.ABiie",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=IldlYXNsZXkgaXMgT3VyIEtpbmci&s=06.ABiie&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=IldlYXNsZXkgaXMgT3VyIEtpbmci&s=06.ABiie",
            definition: "November 2 1995",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=Tm92ZW1iZXIgMiAxOTk1&s=Jd9y7KGr",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Tm92ZW1iZXIgMiAxOTk1&s=Jd9y7KGr&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=Tm92ZW1iZXIgMiAxOTk1&s=Jd9y7KGr",
            _imageUrl: null,
            setId: 510003724,
            rank: 80,
            lastModified: 1590887524,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185870901,
            word: "First meeting of Dumbledore's Army",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Rmlyc3QgbWVldGluZyBvZiBEdW1ibGVkb3JlJ3MgQXJteQ&s=M0Ka1rAX",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Rmlyc3QgbWVldGluZyBvZiBEdW1ibGVkb3JlJ3MgQXJteQ&s=M0Ka1rAX&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Rmlyc3QgbWVldGluZyBvZiBEdW1ibGVkb3JlJ3MgQXJteQ&s=M0Ka1rAX",
            definition: "October 9 1995",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciA5IDE5OTU&s=0g.73D1.",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciA5IDE5OTU&s=0g.73D1.&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciA5IDE5OTU&s=0g.73D1.",
            _imageUrl: null,
            setId: 510003724,
            rank: 79,
            lastModified: 1590887507,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185864295,
            word: "Death of Barty Crouch Sr.",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgQmFydHkgQ3JvdWNoIFNyLg&s=UohDSaQN",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgQmFydHkgQ3JvdWNoIFNyLg&s=UohDSaQN&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RGVhdGggb2YgQmFydHkgQ3JvdWNoIFNyLg&s=UohDSaQN",
            definition: "May 27 1995",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=TWF5IDI3IDE5OTU&s=xNYAWHSv",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWF5IDI3IDE5OTU&s=xNYAWHSv&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=TWF5IDI3IDE5OTU&s=xNYAWHSv",
            _imageUrl: null,
            setId: 510003724,
            rank: 73,
            lastModified: 1590887429,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185863423,
            word: "The Second Task",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=VGhlIFNlY29uZCBUYXNr&s=k9Kkn0YJ",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIFNlY29uZCBUYXNr&s=k9Kkn0YJ&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=VGhlIFNlY29uZCBUYXNr&s=k9Kkn0YJ",
            definition: "February 24 1995",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=RmVicnVhcnkgMjQgMTk5NQ&s=eKfGBljT",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RmVicnVhcnkgMjQgMTk5NQ&s=eKfGBljT&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=RmVicnVhcnkgMjQgMTk5NQ&s=eKfGBljT",
            _imageUrl: null,
            setId: 510003724,
            rank: 71,
            lastModified: 1590887412,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185861492,
            word: "Krum takes Hermione to the Yule Ball",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=S3J1bSB0YWtlcyBIZXJtaW9uZSB0byB0aGUgWXVsZSBCYWxs&s=3cyvnP9m",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=S3J1bSB0YWtlcyBIZXJtaW9uZSB0byB0aGUgWXVsZSBCYWxs&s=3cyvnP9m&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=S3J1bSB0YWtlcyBIZXJtaW9uZSB0byB0aGUgWXVsZSBCYWxs&s=3cyvnP9m",
            definition: "December 25 1994",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMjUgMTk5NA&s=Y1udCO0c",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMjUgMTk5NA&s=Y1udCO0c&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMjUgMTk5NA&s=Y1udCO0c",
            _imageUrl: null,
            setId: 510003724,
            rank: 70,
            lastModified: 1590887390,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185582794,
            word: "harry didja put yer name in the garblarafar",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=aGFycnkgZGlkamEgcHV0IHllciBuYW1lIGluIHRoZSBnYXJibGFyYWZhcg&s=Pd4Kt2Sp",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=aGFycnkgZGlkamEgcHV0IHllciBuYW1lIGluIHRoZSBnYXJibGFyYWZhcg&s=Pd4Kt2Sp&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=aGFycnkgZGlkamEgcHV0IHllciBuYW1lIGluIHRoZSBnYXJibGFyYWZhcg&s=Pd4Kt2Sp",
            definition: "October 31 1994",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMSAxOTk0&s=IobBd1IC",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMSAxOTk0&s=IobBd1IC&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMSAxOTk0&s=IobBd1IC",
            _imageUrl: null,
            setId: 510003724,
            rank: 68,
            lastModified: 1590881040,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185582196,
            word: "The First Task",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=VGhlIEZpcnN0IFRhc2s&s=chBzyYx4",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VGhlIEZpcnN0IFRhc2s&s=chBzyYx4&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=VGhlIEZpcnN0IFRhc2s&s=chBzyYx4",
            definition: "November 24 1994",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=Tm92ZW1iZXIgMjQgMTk5NA&s=brWulfU2",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Tm92ZW1iZXIgMjQgMTk5NA&s=brWulfU2&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=Tm92ZW1iZXIgMjQgMTk5NA&s=brWulfU2",
            _imageUrl: null,
            setId: 510003724,
            rank: 69,
            lastModified: 1590881022,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185581577,
            word: "Hermione founds S.P.E.W.",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGVybWlvbmUgZm91bmRzIFMuUC5FLlcu&s=9FfLcJoB",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGVybWlvbmUgZm91bmRzIFMuUC5FLlcu&s=9FfLcJoB&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGVybWlvbmUgZm91bmRzIFMuUC5FLlcu&s=9FfLcJoB",
            definition: "September 1994",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDE5OTQ&s=kFDnghY2",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDE5OTQ&s=kFDnghY2&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDE5OTQ&s=kFDnghY2",
            _imageUrl: null,
            setId: 510003724,
            rank: 67,
            lastModified: 1590881001,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185581161,
            word: "Chaos in the campground after the World Cup",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Q2hhb3MgaW4gdGhlIGNhbXBncm91bmQgYWZ0ZXIgdGhlIFdvcmxkIEN1cA&s=F3PLofme",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Q2hhb3MgaW4gdGhlIGNhbXBncm91bmQgYWZ0ZXIgdGhlIFdvcmxkIEN1cA&s=F3PLofme&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Q2hhb3MgaW4gdGhlIGNhbXBncm91bmQgYWZ0ZXIgdGhlIFdvcmxkIEN1cA&s=F3PLofme",
            definition: "August 26 1994",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDI2IDE5OTQ&s=r61CMm6T",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDI2IDE5OTQ&s=r61CMm6T&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDI2IDE5OTQ&s=r61CMm6T",
            _imageUrl: null,
            setId: 510003724,
            rank: 66,
            lastModified: 1590880991,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185580206,
            word: "Frank Bryce is killed",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RnJhbmsgQnJ5Y2UgaXMga2lsbGVk&s=37rop5Yj",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RnJhbmsgQnJ5Y2UgaXMga2lsbGVk&s=37rop5Yj&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RnJhbmsgQnJ5Y2UgaXMga2lsbGVk&s=37rop5Yj",
            definition: "August 23 1994",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDIzIDE5OTQ&s=-wlwy.cg",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDIzIDE5OTQ&s=-wlwy.cg&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDIzIDE5OTQ&s=-wlwy.cg",
            _imageUrl: null,
            setId: 510003724,
            rank: 65,
            lastModified: 1590880969,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185579186,
            word: "Harry begins learning to cast the Patronus Charm",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgYmVnaW5zIGxlYXJuaW5nIHRvIGNhc3QgdGhlIFBhdHJvbnVzIENoYXJt&s=OL9-ZN.s",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgYmVnaW5zIGxlYXJuaW5nIHRvIGNhc3QgdGhlIFBhdHJvbnVzIENoYXJt&s=OL9-ZN.s&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgYmVnaW5zIGxlYXJuaW5nIHRvIGNhc3QgdGhlIFBhdHJvbnVzIENoYXJt&s=OL9-ZN.s",
            definition: "January 6 1994",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=SmFudWFyeSA2IDE5OTQ&s=S8Vpv2dn",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SmFudWFyeSA2IDE5OTQ&s=S8Vpv2dn&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SmFudWFyeSA2IDE5OTQ&s=S8Vpv2dn",
            _imageUrl: null,
            setId: 510003724,
            rank: 62,
            lastModified: 1590880934,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185578480,
            word: "Harry receives the Marauder's Map",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgcmVjZWl2ZXMgdGhlIE1hcmF1ZGVyJ3MgTWFw&s=UxXBl9xU",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgcmVjZWl2ZXMgdGhlIE1hcmF1ZGVyJ3MgTWFw&s=UxXBl9xU&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgcmVjZWl2ZXMgdGhlIE1hcmF1ZGVyJ3MgTWFw&s=UxXBl9xU",
            definition: "December 18 1993",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMTggMTk5Mw&s=urM5jdua",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMTggMTk5Mw&s=urM5jdua&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMTggMTk5Mw&s=urM5jdua",
            _imageUrl: null,
            setId: 510003724,
            rank: 60,
            lastModified: 1590880913,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185578132,
            word: "Harry's Nimbus 2000 is smashed by the Whomping Willow",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkncyBOaW1idXMgMjAwMCBpcyBzbWFzaGVkIGJ5IHRoZSBXaG9tcGluZyBXaWxsb3c&s=ItjFrvxT",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkncyBOaW1idXMgMjAwMCBpcyBzbWFzaGVkIGJ5IHRoZSBXaG9tcGluZyBXaWxsb3c&s=ItjFrvxT&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFycnkncyBOaW1idXMgMjAwMCBpcyBzbWFzaGVkIGJ5IHRoZSBXaG9tcGluZyBXaWxsb3c&s=ItjFrvxT",
            definition: "November 1993",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=Tm92ZW1iZXIgMTk5Mw&s=2J0FdkvK",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Tm92ZW1iZXIgMTk5Mw&s=2J0FdkvK&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=Tm92ZW1iZXIgMTk5Mw&s=2J0FdkvK",
            _imageUrl: null,
            setId: 510003724,
            rank: 59,
            lastModified: 1590880902,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185576515,
            word: "Hagrid begins his professorship",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFncmlkIGJlZ2lucyBoaXMgcHJvZmVzc29yc2hpcA&s=VOGWYFYZ",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFncmlkIGJlZ2lucyBoaXMgcHJvZmVzc29yc2hpcA&s=VOGWYFYZ&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFncmlkIGJlZ2lucyBoaXMgcHJvZmVzc29yc2hpcA&s=VOGWYFYZ",
            definition: "September 1 1993",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDEgMTk5Mw&s=uxi6rgUY",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDEgMTk5Mw&s=uxi6rgUY&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDEgMTk5Mw&s=uxi6rgUY",
            _imageUrl: null,
            setId: 510003724,
            rank: 57,
            lastModified: 1590880864,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185575742,
            word: "Hermione buys Crookshanks",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGVybWlvbmUgYnV5cyBDcm9va3NoYW5rcw&s=qSM0dg6h",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGVybWlvbmUgYnV5cyBDcm9va3NoYW5rcw&s=qSM0dg6h&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGVybWlvbmUgYnV5cyBDcm9va3NoYW5rcw&s=qSM0dg6h",
            definition: "August 31 1993",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDMxIDE5OTM&s=5wUjEi3X",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDMxIDE5OTM&s=5wUjEi3X&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDMxIDE5OTM&s=5wUjEi3X",
            _imageUrl: null,
            setId: 510003724,
            rank: 56,
            lastModified: 1590880840,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185575366,
            word: "Harry blows up Aunt Marge",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgYmxvd3MgdXAgQXVudCBNYXJnZQ&s=2UPLYwTP",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgYmxvd3MgdXAgQXVudCBNYXJnZQ&s=2UPLYwTP&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgYmxvd3MgdXAgQXVudCBNYXJnZQ&s=2UPLYwTP",
            definition: "August 6 1993",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDYgMTk5Mw&s=DkGVZOE7",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDYgMTk5Mw&s=DkGVZOE7&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDYgMTk5Mw&s=DkGVZOE7",
            _imageUrl: null,
            setId: 510003724,
            rank: 55,
            lastModified: 1590880828,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185574972,
            word: "Sirius Black escapes from Azkaban",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U2lyaXVzIEJsYWNrIGVzY2FwZXMgZnJvbSBBemthYmFu&s=KXISBbi7",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2lyaXVzIEJsYWNrIGVzY2FwZXMgZnJvbSBBemthYmFu&s=KXISBbi7&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U2lyaXVzIEJsYWNrIGVzY2FwZXMgZnJvbSBBemthYmFu&s=KXISBbi7",
            definition: "July 30 1993",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=SnVseSAzMCAxOTkz&s=EmtU8WP9",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVseSAzMCAxOTkz&s=EmtU8WP9&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SnVseSAzMCAxOTkz&s=EmtU8WP9",
            _imageUrl: null,
            setId: 510003724,
            rank: 54,
            lastModified: 1590880813,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185572340,
            word: "Hermione is petrified",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGVybWlvbmUgaXMgcGV0cmlmaWVk&s=iryBqI0H",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGVybWlvbmUgaXMgcGV0cmlmaWVk&s=iryBqI0H&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGVybWlvbmUgaXMgcGV0cmlmaWVk&s=iryBqI0H",
            definition: "May 8 1993",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=TWF5IDggMTk5Mw&s=a.2.eEaH",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWF5IDggMTk5Mw&s=a.2.eEaH&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=TWF5IDggMTk5Mw&s=a.2.eEaH",
            _imageUrl: null,
            setId: 510003724,
            rank: 50,
            lastModified: 1590880740,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185571650,
            word: "Hermione polyjuices into a cat",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGVybWlvbmUgcG9seWp1aWNlcyBpbnRvIGEgY2F0&s=nH4IbIlV",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGVybWlvbmUgcG9seWp1aWNlcyBpbnRvIGEgY2F0&s=nH4IbIlV&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGVybWlvbmUgcG9seWp1aWNlcyBpbnRvIGEgY2F0&s=nH4IbIlV",
            definition: "December 25 1992",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMjUgMTk5Mg&s=b3Igtn2M",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMjUgMTk5Mg&s=b3Igtn2M&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMjUgMTk5Mg&s=b3Igtn2M",
            _imageUrl: null,
            setId: 510003724,
            rank: 48,
            lastModified: 1590880726,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185566657,
            word: "Colin Creevey is petrified",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Q29saW4gQ3JlZXZleSBpcyBwZXRyaWZpZWQ&s=ZPXXRINz",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Q29saW4gQ3JlZXZleSBpcyBwZXRyaWZpZWQ&s=ZPXXRINz&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Q29saW4gQ3JlZXZleSBpcyBwZXRyaWZpZWQ&s=ZPXXRINz",
            definition: "November 8 1992",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=Tm92ZW1iZXIgOCAxOTky&s=6XqTxrCu",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Tm92ZW1iZXIgOCAxOTky&s=6XqTxrCu&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=Tm92ZW1iZXIgOCAxOTky&s=6XqTxrCu",
            _imageUrl: null,
            setId: 510003724,
            rank: 46,
            lastModified: 1590880631,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185566309,
            word: "Harry loses the bones in his arm",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgbG9zZXMgdGhlIGJvbmVzIGluIGhpcyBhcm0&s=eNFoH2fZ",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgbG9zZXMgdGhlIGJvbmVzIGluIGhpcyBhcm0&s=eNFoH2fZ&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgbG9zZXMgdGhlIGJvbmVzIGluIGhpcyBhcm0&s=eNFoH2fZ",
            definition: "November 7 1992",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=Tm92ZW1iZXIgNyAxOTky&s=Dh2KJNCv",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Tm92ZW1iZXIgNyAxOTky&s=Dh2KJNCv&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=Tm92ZW1iZXIgNyAxOTky&s=Dh2KJNCv",
            _imageUrl: null,
            setId: 510003724,
            rank: 45,
            lastModified: 1590880620,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185564995,
            word: "Mrs. Norris is petrified",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TXJzLiBOb3JyaXMgaXMgcGV0cmlmaWVk&s=QNUDAQnL",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TXJzLiBOb3JyaXMgaXMgcGV0cmlmaWVk&s=QNUDAQnL&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TXJzLiBOb3JyaXMgaXMgcGV0cmlmaWVk&s=QNUDAQnL",
            definition: "October 31 1992",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMSAxOTky&s=zKwtG0J.",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMSAxOTky&s=zKwtG0J.&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMSAxOTky&s=zKwtG0J.",
            _imageUrl: null,
            setId: 510003724,
            rank: 44,
            lastModified: 1590880587,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185564055,
            word: "Ginny Weasley opens the Chamber of Secrets",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=R2lubnkgV2Vhc2xleSBvcGVucyB0aGUgQ2hhbWJlciBvZiBTZWNyZXRz&s=SfyMy7rX",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=R2lubnkgV2Vhc2xleSBvcGVucyB0aGUgQ2hhbWJlciBvZiBTZWNyZXRz&s=SfyMy7rX&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=R2lubnkgV2Vhc2xleSBvcGVucyB0aGUgQ2hhbWJlciBvZiBTZWNyZXRz&s=SfyMy7rX",
            definition: "September 8 1992",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDggMTk5Mg&s=bASKa-qd",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDggMTk5Mg&s=bASKa-qd&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDggMTk5Mg&s=bASKa-qd",
            _imageUrl: null,
            setId: 510003724,
            rank: 43,
            lastModified: 1590880574,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185563269,
            word: "Harry and Ron fly the Ford Angelina to Hogwarts",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgYW5kIFJvbiBmbHkgdGhlIEZvcmQgQW5nZWxpbmEgdG8gSG9nd2FydHM&s=rd3WlUUW",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgYW5kIFJvbiBmbHkgdGhlIEZvcmQgQW5nZWxpbmEgdG8gSG9nd2FydHM&s=rd3WlUUW&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgYW5kIFJvbiBmbHkgdGhlIEZvcmQgQW5nZWxpbmEgdG8gSG9nd2FydHM&s=rd3WlUUW",
            definition: "September 1 1992",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDEgMTk5Mg&s=Oyq1Hb.p",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDEgMTk5Mg&s=Oyq1Hb.p&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDEgMTk5Mg&s=Oyq1Hb.p",
            _imageUrl: null,
            setId: 510003724,
            rank: 40,
            lastModified: 1590880550,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185562541,
            word: "Harry mistakenly visits Knockturn Ally",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgbWlzdGFrZW5seSB2aXNpdHMgS25vY2t0dXJuIEFsbHk&s=Yt9ABkYT",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgbWlzdGFrZW5seSB2aXNpdHMgS25vY2t0dXJuIEFsbHk&s=Yt9ABkYT&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgbWlzdGFrZW5seSB2aXNpdHMgS25vY2t0dXJuIEFsbHk&s=Yt9ABkYT",
            definition: "August 19 1992",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDE5IDE5OTI&s=mK54Gj7s",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDE5IDE5OTI&s=mK54Gj7s&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDE5IDE5OTI&s=mK54Gj7s",
            _imageUrl: null,
            setId: 510003724,
            rank: 39,
            lastModified: 1590880533,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185557006,
            word: "Hagrid sees Voldemort drinking unicorn blood in the Forbidden Forest",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFncmlkIHNlZXMgVm9sZGVtb3J0IGRyaW5raW5nIHVuaWNvcm4gYmxvb2QgaW4gdGhlIEZvcmJpZGRlbiBGb3Jlc3Q&s=MQ2PvY1K",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFncmlkIHNlZXMgVm9sZGVtb3J0IGRyaW5raW5nIHVuaWNvcm4gYmxvb2QgaW4gdGhlIEZvcmJpZGRlbiBGb3Jlc3Q&s=MQ2PvY1K&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFncmlkIHNlZXMgVm9sZGVtb3J0IGRyaW5raW5nIHVuaWNvcm4gYmxvb2QgaW4gdGhlIEZvcmJpZGRlbiBGb3Jlc3Q&s=MQ2PvY1K",
            definition: "May 26 1992",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=TWF5IDI2IDE5OTI&s=-yTw5prv",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWF5IDI2IDE5OTI&s=-yTw5prv&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=TWF5IDI2IDE5OTI&s=-yTw5prv",
            _imageUrl: null,
            setId: 510003724,
            rank: 31,
            lastModified: 1590880455,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185557005,
            word: "Norbert hatches",
            _wordTtsUrl: "/tts/en.mp3?v=14&b=Tm9yYmVydCBoYXRjaGVz&s=6FVB-BeS",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Tm9yYmVydCBoYXRjaGVz&s=6FVB-BeS&speed=70",
            _wordAudioUrl: "/tts/en.mp3?v=14&b=Tm9yYmVydCBoYXRjaGVz&s=6FVB-BeS",
            definition: "April 1992",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=QXByaWwgMTk5Mg&s=qH8JyFEY",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QXByaWwgMTk5Mg&s=qH8JyFEY&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=QXByaWwgMTk5Mg&s=qH8JyFEY",
            _imageUrl: null,
            setId: 510003724,
            rank: 30,
            lastModified: 1590880401,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185555613,
            word: "Harry receives the Invisibility Cloak",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgcmVjZWl2ZXMgdGhlIEludmlzaWJpbGl0eSBDbG9haw&s=Dce3LEMc",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgcmVjZWl2ZXMgdGhlIEludmlzaWJpbGl0eSBDbG9haw&s=Dce3LEMc&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgcmVjZWl2ZXMgdGhlIEludmlzaWJpbGl0eSBDbG9haw&s=Dce3LEMc",
            definition: "December 25 1991",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMjUgMTk5MQ&s=rO2NnuwH",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMjUgMTk5MQ&s=rO2NnuwH&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMjUgMTk5MQ&s=rO2NnuwH",
            _imageUrl: null,
            setId: 510003724,
            rank: 27,
            lastModified: 1590880357,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185555162,
            word: "Harry's First Quidditch Match",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkncyBGaXJzdCBRdWlkZGl0Y2ggTWF0Y2g&s=q7HIkb1J",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkncyBGaXJzdCBRdWlkZGl0Y2ggTWF0Y2g&s=q7HIkb1J&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFycnkncyBGaXJzdCBRdWlkZGl0Y2ggTWF0Y2g&s=q7HIkb1J",
            definition: "November 9 1991",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=Tm92ZW1iZXIgOSAxOTkx&s=7N3eIXtu",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Tm92ZW1iZXIgOSAxOTkx&s=7N3eIXtu&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=Tm92ZW1iZXIgOSAxOTkx&s=7N3eIXtu",
            _imageUrl: null,
            setId: 510003724,
            rank: 26,
            lastModified: 1590880344,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185552020,
            word: "Harry receives his Nimbus 2000",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgcmVjZWl2ZXMgaGlzIE5pbWJ1cyAyMDAw&s=darZEZVL",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgcmVjZWl2ZXMgaGlzIE5pbWJ1cyAyMDAw&s=darZEZVL&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgcmVjZWl2ZXMgaGlzIE5pbWJ1cyAyMDAw&s=darZEZVL",
            definition: "September 19 1991",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDE5IDE5OTE&s=EJxXu7tb",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDE5IDE5OTE&s=EJxXu7tb&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDE5IDE5OTE&s=EJxXu7tb",
            _imageUrl: null,
            setId: 510003724,
            rank: 23,
            lastModified: 1590880293,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185549294,
            word: "Harry first rides a broom",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgZmlyc3QgcmlkZXMgYSBicm9vbQ&s=oQut6hoN",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgZmlyc3QgcmlkZXMgYSBicm9vbQ&s=oQut6hoN&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgZmlyc3QgcmlkZXMgYSBicm9vbQ&s=oQut6hoN",
            definition: "September 12 1991",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDEyIDE5OTE&s=uv.XrZH7",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDEyIDE5OTE&s=uv.XrZH7&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDEyIDE5OTE&s=uv.XrZH7",
            _imageUrl: null,
            setId: 510003724,
            rank: 21,
            lastModified: 1590880249,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185548624,
            word: "Harry visits Diagon Alley",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgdmlzaXRzIERpYWdvbiBBbGxleQ&s=XCZ34I1g",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgdmlzaXRzIERpYWdvbiBBbGxleQ&s=XCZ34I1g&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgdmlzaXRzIERpYWdvbiBBbGxleQ&s=XCZ34I1g",
            definition: "July 31 1991",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=SnVseSAzMSAxOTkx&s=.bGTztP8",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVseSAzMSAxOTkx&s=.bGTztP8&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SnVseSAzMSAxOTkx&s=.bGTztP8",
            _imageUrl: null,
            setId: 510003724,
            rank: 18,
            lastModified: 1590880238,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185530486,
            word: "Harry Potter is born",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgUG90dGVyIGlzIGJvcm4&s=U5hvq5UJ",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgUG90dGVyIGlzIGJvcm4&s=U5hvq5UJ&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFycnkgUG90dGVyIGlzIGJvcm4&s=U5hvq5UJ",
            definition: "July 31 1980",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=SnVseSAzMSAxOTgw&s=r61-NPNc",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVseSAzMSAxOTgw&s=r61-NPNc&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SnVseSAzMSAxOTgw&s=r61-NPNc",
            _imageUrl: null,
            setId: 510003724,
            rank: 13,
            lastModified: 1590880166,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185527380,
            word: "Remus Lupin is bitten by Greyback",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=UmVtdXMgTHVwaW4gaXMgYml0dGVuIGJ5IEdyZXliYWNr&s=DJEu8Hoj",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=UmVtdXMgTHVwaW4gaXMgYml0dGVuIGJ5IEdyZXliYWNr&s=DJEu8Hoj&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=UmVtdXMgTHVwaW4gaXMgYml0dGVuIGJ5IEdyZXliYWNr&s=DJEu8Hoj",
            definition: "March 1965",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=TWFyY2ggMTk2NQ&s=XFvGShdK",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWFyY2ggMTk2NQ&s=XFvGShdK&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=TWFyY2ggMTk2NQ&s=XFvGShdK",
            _imageUrl: null,
            setId: 510003724,
            rank: 11,
            lastModified: 1590880135,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185525643,
            word: "Moaning Myrtle's death",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TW9hbmluZyBNeXJ0bGUncyBkZWF0aA&s=ZqHNJ0ot",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TW9hbmluZyBNeXJ0bGUncyBkZWF0aA&s=ZqHNJ0ot&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TW9hbmluZyBNeXJ0bGUncyBkZWF0aA&s=ZqHNJ0ot",
            definition: "June 12 1943",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=SnVuZSAxMiAxOTQz&s=7RnnU4RN",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAxMiAxOTQz&s=7RnnU4RN&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=SnVuZSAxMiAxOTQz&s=7RnnU4RN",
            _imageUrl: null,
            setId: 510003724,
            rank: 9,
            lastModified: 1590880090,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185524847,
            word: "Tom Riddle murders his father and grandparents",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VG9tIFJpZGRsZSBtdXJkZXJzIGhpcyBmYXRoZXIgYW5kIGdyYW5kcGFyZW50cw&s=3C0WK55n",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VG9tIFJpZGRsZSBtdXJkZXJzIGhpcyBmYXRoZXIgYW5kIGdyYW5kcGFyZW50cw&s=3C0WK55n&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VG9tIFJpZGRsZSBtdXJkZXJzIGhpcyBmYXRoZXIgYW5kIGdyYW5kcGFyZW50cw&s=3C0WK55n",
            definition: "July 1942",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=SnVseSAxOTQy&s=2.0eFBE5",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SnVseSAxOTQy&s=2.0eFBE5&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=SnVseSAxOTQy&s=2.0eFBE5",
            _imageUrl: null,
            setId: 510003724,
            rank: 8,
            lastModified: 1590880078,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185524473,
            word: "Dumbledore visits Tom RIddle's orphanage",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RHVtYmxlZG9yZSB2aXNpdHMgVG9tIFJJZGRsZSdzIG9ycGhhbmFnZQ&s=zOWKwyyu",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RHVtYmxlZG9yZSB2aXNpdHMgVG9tIFJJZGRsZSdzIG9ycGhhbmFnZQ&s=zOWKwyyu&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RHVtYmxlZG9yZSB2aXNpdHMgVG9tIFJJZGRsZSdzIG9ycGhhbmFnZQ&s=zOWKwyyu",
            definition: "August 1938",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=QXVndXN0IDE5Mzg&s=OJul7hDk",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDE5Mzg&s=OJul7hDk&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDE5Mzg&s=OJul7hDk",
            _imageUrl: null,
            setId: 510003724,
            rank: 7,
            lastModified: 1590880078,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185523885,
            word: "Tom Marvolo Riddle is born",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=VG9tIE1hcnZvbG8gUmlkZGxlIGlzIGJvcm4&s=opS.-2DE",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=VG9tIE1hcnZvbG8gUmlkZGxlIGlzIGJvcm4&s=opS.-2DE&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=VG9tIE1hcnZvbG8gUmlkZGxlIGlzIGJvcm4&s=opS.-2DE",
            definition: "December 31 1926",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMzEgMTkyNg&s=cG3jEavr",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMzEgMTkyNg&s=cG3jEavr&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMzEgMTkyNg&s=cG3jEavr",
            _imageUrl: null,
            setId: 510003724,
            rank: 6,
            lastModified: 1590880062,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185522081,
            word: "Merope Gaunt marries Tom Riddle",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TWVyb3BlIEdhdW50IG1hcnJpZXMgVG9tIFJpZGRsZQ&s=u1XfUbnC",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWVyb3BlIEdhdW50IG1hcnJpZXMgVG9tIFJpZGRsZQ&s=u1XfUbnC&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TWVyb3BlIEdhdW50IG1hcnJpZXMgVG9tIFJpZGRsZQ&s=u1XfUbnC",
            definition: "December 1925",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMTkyNQ&s=PXYm4ktP",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMTkyNQ&s=PXYm4ktP&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=RGVjZW1iZXIgMTkyNQ&s=PXYm4ktP",
            _imageUrl: null,
            setId: 510003724,
            rank: 5,
            lastModified: 1590880062,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185520278,
            word: "Albus Dumbledore is born",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=QWxidXMgRHVtYmxlZG9yZSBpcyBib3Ju&s=PvhFFJBp",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QWxidXMgRHVtYmxlZG9yZSBpcyBib3Ju&s=PvhFFJBp&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=QWxidXMgRHVtYmxlZG9yZSBpcyBib3Ju&s=PvhFFJBp",
            definition: "August 1881",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=QXVndXN0IDE4ODE&s=sMdk7RGY",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDE4ODE&s=sMdk7RGY&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=QXVndXN0IDE4ODE&s=sMdk7RGY",
            _imageUrl: null,
            setId: 510003724,
            rank: 4,
            lastModified: 1590880046,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185517635,
            word: "Sir Nicholas de Mimsy-Porpington is beheaded (nearly)",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=U2lyIE5pY2hvbGFzIGRlIE1pbXN5LVBvcnBpbmd0b24gaXMgYmVoZWFkZWQgKG5lYXJseSk&s=7TAXDGNW",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2lyIE5pY2hvbGFzIGRlIE1pbXN5LVBvcnBpbmd0b24gaXMgYmVoZWFkZWQgKG5lYXJseSk&s=7TAXDGNW&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=U2lyIE5pY2hvbGFzIGRlIE1pbXN5LVBvcnBpbmd0b24gaXMgYmVoZWFkZWQgKG5lYXJseSk&s=7TAXDGNW",
            definition: "October 31 1492",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMSAxNDky&s=gw.IVD0h",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMSAxNDky&s=gw.IVD0h&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=T2N0b2JlciAzMSAxNDky&s=gw.IVD0h",
            _imageUrl: null,
            setId: 510003724,
            rank: 2,
            lastModified: 1590880022,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18169235782,
            word: "Nicholas Flamel is born",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TmljaG9sYXMgRmxhbWVsIGlzIGJvcm4&s=jcyGSVEX",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TmljaG9sYXMgRmxhbWVsIGlzIGJvcm4&s=jcyGSVEX&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TmljaG9sYXMgRmxhbWVsIGlzIGJvcm4&s=jcyGSVEX",
            definition: "~1326",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=fjEzMjY&s=x1By.frf",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=fjEzMjY&s=x1By.frf&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=fjEzMjY&s=x1By.frf",
            _imageUrl: null,
            setId: 510003724,
            rank: 0,
            lastModified: 1590880004,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185537539,
            word: "Harry, Ron, and Hermione meet",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnksIFJvbiwgYW5kIEhlcm1pb25lIG1lZXQ&s=vUNTeQrV",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=SGFycnksIFJvbiwgYW5kIEhlcm1pb25lIG1lZXQ&s=vUNTeQrV&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=SGFycnksIFJvbiwgYW5kIEhlcm1pb25lIG1lZXQ&s=vUNTeQrV",
            definition: "September 1st 1991",
            _definitionTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDFzdCAxOTkx&s=SlhiKlTl",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDFzdCAxOTkx&s=SlhiKlTl&speed=70",
            _definitionAudioUrl:
              "/tts/en.mp3?v=14&b=U2VwdGVtYmVyIDFzdCAxOTkx&s=SlhiKlTl",
            _imageUrl: null,
            setId: 510003724,
            rank: 19,
            lastModified: 1590879981,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185528884,
            word: "Marauder's Map is written",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TWFyYXVkZXIncyBNYXAgaXMgd3JpdHRlbg&s=Dw8DtpsU",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWFyYXVkZXIncyBNYXAgaXMgd3JpdHRlbg&s=Dw8DtpsU&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TWFyYXVkZXIncyBNYXAgaXMgd3JpdHRlbg&s=Dw8DtpsU",
            definition: "1975",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk3NQ&s=AamaUfyq",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk3NQ&s=AamaUfyq&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk3NQ&s=AamaUfyq",
            _imageUrl: null,
            setId: 510003724,
            rank: 12,
            lastModified: 1590879759,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185526471,
            word: "Dumbledore defeats Grindlewald",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=RHVtYmxlZG9yZSBkZWZlYXRzIEdyaW5kbGV3YWxk&s=J5n4xywg",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=RHVtYmxlZG9yZSBkZWZlYXRzIEdyaW5kbGV3YWxk&s=J5n4xywg&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=RHVtYmxlZG9yZSBkZWZlYXRzIEdyaW5kbGV3YWxk&s=J5n4xywg",
            definition: "1945",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTk0NQ&s=BsDdab8p",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTk0NQ&s=BsDdab8p&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTk0NQ&s=BsDdab8p",
            _imageUrl: null,
            setId: 510003724,
            rank: 10,
            lastModified: 1590879696,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185519252,
            word: "Ministry of Magic is formed",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=TWluaXN0cnkgb2YgTWFnaWMgaXMgZm9ybWVk&s=wKOhOmOg",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=TWluaXN0cnkgb2YgTWFnaWMgaXMgZm9ybWVk&s=wKOhOmOg&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=TWluaXN0cnkgb2YgTWFnaWMgaXMgZm9ybWVk&s=wKOhOmOg",
            definition: "1707",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTcwNw&s=JJAlJuSt",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTcwNw&s=JJAlJuSt&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTcwNw&s=JJAlJuSt",
            _imageUrl: null,
            setId: 510003724,
            rank: 3,
            lastModified: 1590879542,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
          {
            id: 18185516442,
            word: "First Quidditch World Cup",
            _wordTtsUrl:
              "/tts/en.mp3?v=14&b=Rmlyc3QgUXVpZGRpdGNoIFdvcmxkIEN1cA&s=q9FhJQ9f",
            _wordSlowTtsUrl:
              "/tts/en.mp3?v=14&b=Rmlyc3QgUXVpZGRpdGNoIFdvcmxkIEN1cA&s=q9FhJQ9f&speed=70",
            _wordAudioUrl:
              "/tts/en.mp3?v=14&b=Rmlyc3QgUXVpZGRpdGNoIFdvcmxkIEN1cA&s=q9FhJQ9f",
            definition: "1473",
            _definitionTtsUrl: "/tts/en.mp3?v=14&b=MTQ3Mw&s=Cxy8ZYlH",
            _definitionSlowTtsUrl:
              "/tts/en.mp3?v=14&b=MTQ3Mw&s=Cxy8ZYlH&speed=70",
            _definitionAudioUrl: "/tts/en.mp3?v=14&b=MTQ3Mw&s=Cxy8ZYlH",
            _imageUrl: null,
            setId: 510003724,
            rank: 1,
            lastModified: 1590879495,
            wordCustomAudioId: null,
            definitionCustomAudioId: null,
            definitionImageId: null,
            definitionRichText: null,
            wordRichText: null,
            definitionCustomDistractors: null,
            wordCustomDistractors: null,
          },
        ],
      },
      paging: {
        total: 101,
        page: 1,
        perPage: 200,
        token: "mk5xeEHtjC.3XszavS2jQqcp3uXk",
      },
    },
  ],
};
