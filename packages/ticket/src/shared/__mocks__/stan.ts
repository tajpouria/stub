export const stan = {
  instance: {
    publish: jest
      .fn()
      .mockImplementation((subject: string, data: string, cb: () => void) => {
        cb();
      }),
  },
};
