let protectedUniqueIDService;

class UniqueIdService {

  constructor(uuid) {
    UniqueIdService.uuidLib = uuid;
  }

  /**
   * Creates a time based unique id.
   * @param {options} options The options of the creation
   * @returns {string} The created unique id.
   */
  createUniqueId(options) {
    return UniqueIdService.uuidLib.v1(options);
  }

}

function getUniqueIdServiceInstance(uuid) {

  protectedUniqueIDService = protectedUniqueIDService || new UniqueIdService(uuid);

  return protectedUniqueIDService;
}

module.exports = getUniqueIdServiceInstance;
