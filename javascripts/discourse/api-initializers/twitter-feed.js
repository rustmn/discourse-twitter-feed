import { apiInitializer } from "discourse/lib/api";

const config = {
  sidebar_container: 'twitter-sidebar',
};

const paths_to_twitter_screenNames_relations = {
  '/': 'layer5',
  'meshery': 'mesheryio',
  'smp': 'smp_spec',
  'getnighthawk': 'smp_spec'
};

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

function parsePath(doc_path) {
  let response = 'layer5';

  Object.keys(paths_to_twitter_screenNames_relations)
    .forEach(path => {
      
      if (doc_path.includes(path)) {
        response = paths_to_twitter_screenNames_relations[path];
      }
    });

  return response;
}

export default apiInitializer("0.11.1", api => {
  api.createWidget('twitter-widget', {
    tagName: `div#${config.sidebar_container}`,

    init() {
      api.onPageChange(url => {
        insertTimeline(
          parsePath(url)
        );
      });
    },
  });
});
