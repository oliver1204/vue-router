/**
 * routes 格式化
 * @param {*} routes
 * @param {*} oldPathList 处理好的路径集合 [/， /about, /about/a, /about/b]
 * @param {*} oldPathMap {'/': 'Home', /about: About, '/about/a': 'a', '/about/b': 'b'}
 */
export function createRouteMap(routes, oldPathList, oldPathMap) {
  const pathList = oldPathList || [];
  const pathMap = oldPathMap || Object.create(null);

  routes.forEach((route) => {
    // 根据用户的路由，实现格式化路径
    addRouteRecord(pathList, pathMap, route);
  });

  return {
    pathList,
    pathMap,
  };
}

function addRouteRecord(pathList, pathMap, route, parent) {
  let { path, component } = route;
  path = parent ? `${parent.path}/${path}` : path;
  let record = {
    path,
    component,
    parent,
  };

  if (!pathMap[path]) {
    pathList.push(path);
    pathMap[path] = record;
  }

  if (route.children) {
    route.children.forEach((route) =>
      addRouteRecord(pathList, pathMap, route, record)
    );
  }
}
