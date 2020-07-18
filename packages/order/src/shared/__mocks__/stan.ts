export const stan = {
  instance: {
    // Mock actions
    publish: jest
      .fn()
      .mockImplementation((subject: string, data: string, cb: () => void) => {
        cb();
      }),
  },
};
