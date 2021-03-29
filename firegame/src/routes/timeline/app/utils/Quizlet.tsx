const _api_url = "https://quizlet.com/webapi/3.1/";
const TERMS_URL = _api_url + "terms?filters[isDeleted]=0&filters[setId]=";
const SET_URL = _api_url + "sets/";
const SEARCH_URL = SET_URL + "search?filters[isDeleted]=0&perPage=9&query=";
const FOLDER_URL =
  _api_url + "folder-sets?filters[folderId]=49189251&filters[isDeleted]=0";

function _fetch(base: string, path: string): Promise<any> {
  return Promise.resolve()
    .then(() => downloaded[base + path].responses[0].models)
    .catch(() => console.log(`downloaded["${base + path}"] = `));
  //   return fetch(base + path)
  //     .then((response) => response.json())
  //     .then((response) => response.responses[0].models);
}

const downloaded: { [key: string]: any } = {};

export default {
  fetch: _fetch,
  TERMS_URL,
  SEARCH_URL,
  FOLDER_URL,
  SET_URL,
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
            word:
              "J. Edgar Hoover appointed Director of the Bureau of Investigation",
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
