/**
 * 将数据扁平化处理
 */
import { createRouteMap } from './create-route-map';
import { createRoute } from './history/base';

export function createMatcher(routes) {
  /**
   * pathList: 处理好的路径集合 [/， /about, /about/a, /about/b]
   * pathMap:{'/': 'Home', /about: About, '/about/a': 'a', '/about/b': 'b'}
   */
  const { pathList, pathMap } = createRouteMap(routes);

  function addRoutes(routes) {
    createRouteMap(routes, pathList, pathMap);
  }

  function match(location) {
    let record = pathMap[location];

    return createRoute(record, {
      path: location,
    });
  }

  return {
    addRoutes,
    match,
  };
}
