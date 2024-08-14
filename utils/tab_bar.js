let selectTab = pageCtx => {
    if (typeof pageCtx.getTabBar === 'function' && pageCtx.getTabBar()) {
        //console.log('utils', 'tab_bar.js', 'selectTab', pageCtx);
        let tabList = pageCtx.getTabBar().data.list;
        let pagePath = '/' + pageCtx.route;
        let tabIndex = 0;
        for (let index = 0; index < tabList.length; index++) {
            let element = tabList[index];
            //console.log('utils', 'tab_bar.js', 'selectTab', pageCtx, pagePath, element);
            if (pagePath === element.pagePath) {
                tabIndex = index;
                break;
            }
        }
        pageCtx.getTabBar().setData({
            selected: tabIndex
        });
    }
}

module.exports = {
    selectTab: selectTab
}