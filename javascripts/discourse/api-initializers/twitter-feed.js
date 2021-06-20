import { apiInitializer } from "discourse/lib/api";

const config = {
  sidebar_container: 'twitter-sidebar',
  sidebar_mainpage_container: 'latest-topic-list'
};

function parseSetup(raw) {
  const parsed = {};
  console.log('raw: ', raw);

  raw.split('|').forEach(item => {
    [path, screenName] = item.split(':').map(str => str.trim());
    parsed[path] = screenName;
  });
  console.log('parsed: ', parsed);
  return parsed;
}

function insertTimeline(screenName) {
  let twitterSidebar = document.getElementById(config.sidebar_container);
  const sidebar = document.getElementById('sidebar');

  if (!twitterSidebar) {
      const container = document.getElementsByClassName(config.sidebar_mainpage_container);
      if (!twitterSidebar && !container.length) {
          console.warn('Twitter timeline not loaded');
          return;
      }
      
      twitterSidebar = container[0].parentNode;
  }

  sidebar.classList.remove('sb-loading');

  const iframe_width = twitterSidebar.style.width;
  const iframe_height = twitterSidebar.style.height;

  try {
    twttr.widgets.createTimeline(
      {
        sourceType: 'profile',
        screenName
      },
      twitterSidebar,
      {
        width: iframe_width,
        height: iframe_height,
        chrome: 'noborders'
      }
    );
  }
  catch (err) {
    console.error(err.msg || err.message);
  }
}

function parsePath(doc_path, paths_relations) {
  let response = 'layer5';

  Object.keys(paths_relations)
    .forEach(path => {
      
      if (doc_path.includes(path)) {
        response = paths_relations[path];
      }
    });

  return response;
}

export default apiInitializer("0.11.1", api => {
  api.createWidget('twitter-widget', {
    tagName: `div#${config.sidebar_container}`,

    init() {
      const paths_relations = parseSetup(settings.paths_relations);

      api.onPageChange(url => {
        insertTimeline(
          parsePath(url, paths_relations)
        );
      });
    },
  });
});
