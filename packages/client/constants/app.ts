export const base64src = {
  noPic:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAM1BMVEXv7+/KysrMzMzn5+ft7e3Pz8/l5eXi4uLd3d3p6enr6+va2trT09Pf39/R0dHX19fV1dXwDvDoAAAD+UlEQVR42u2b23LjIBBEuYOELv7/r92saxNstQR2olCarT6PcRJzLAZ6hKwIIYQQQgghhBBCCCGEEEIIIYS8yXoLTv0HjFprnwYlnqTv3KLwy+IW/Q+frRJM0A9M86iksuonTA5KJKPRWxaRlR/1DkZg5U96H59kVb7Vx0ySLkvWe8hbkJ3XDRYZC3Is8yjcjN7FrAKi2E1/EpUa0qLvyFuQh1INTn3gwoqXRUIUS/qT/LVBzpO8yn8odasKNvvDBfmalR/KCDe5JZbLIiGKraXUsXySF1P5JS8amDHVyjcX643nTakDRwvy1XrjMshQqaNsrl75tsz6+gyMF1+QS15MTefsrxvFHJR6DRdv+qJRLJb0oZ4RVvlD+OSlySE6iu0wzkunyh/sFnUW7Sh2ZuVDTRqnTqNd+fkXe1erTqMdxcz5sQMWpZNxu71xOm9NPfOfv78gDz+uwL+E9SgV2e8CA6tHsUn9FP1LeKcqQG8cBYs89TVOtMhjXyNapFS8FS0SHvoa0SKlr5lFizzewhAtUvbgVZ0pssYNSVcw3nvzM5Gyi4RTReaXz6SWHO3onBttzP7bIhZ+9SSRhIvKLmtwzwmwLdK+hdFf5Gbxo52qIu22YegvYmKzBUCR9i2M7iLeqn2Cr4m0j7w6F7sfjyvXo8jLR14ni+RhQ9wOrTaXrQGRd468um2IuNo753DOo0i71G1vkawKNk3e+ykNMOlBpH3k1UsE89Cwlps4Dz81IPLSkVdvkbRZonAhyyDSIS8W3rsgWNZmgIWoLTJDXuwmcju8kbc4SIEgUjny6i0y47qJL4FI+8jL9RaxMLtxyKEtgnmxs4gfcbAwPcaGCM5OM3YXwemDc8t5EGnmxd4iU9kAkFwRabSGokUgL/YUWUqdIuk9kQR/2EEEhhVrxW7qItga9hOB9xwqm74F9WZe7C8SIORiLJ5BpNka9hfJUKq4F6wgUs2L3vUTwXHhnYZYhlgXwdawqwjOg4S7IRqiCB4ldBbByoy+DDfAF3xApHKU0FcES3NM90GbaXabHgNF3FFrOPcSqd8MGmywIxYxiqQpjpXWsLdIu5mb9IGI1j6HSmvYVaSdKLI+FvlgSSPkxY4iaNL2QJHyvBzkxU4iSN5/e5d1ReQLn1b4TPqIINOgELvotghmt54iiEnjNnNkDdREsDXsL4JP7jl4TLklgnmxowi6zMHaEObVawBEDl68gsg7KXM+ytLSRDZPypa8KE3k35OyGEAFinwQst+WukwRpVycnvOiVJEPbPIPpS5Y5P4As4G8eBLmlzg6MBjSqgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCBHAHxgiLHLq/sshAAAAAElFTkSuQmCC',
};

export const regexPattern = {
  username: '^(?=.{3,30}$).*$',
  password: '^(?=.*[0-9])(?=.*[a-z]).{6,32}$',
  url: '((http|https)://?)[^s()<>]+(?:([wd]+)|([^[:punct:]s]|/?))',
  ticketTitle: '^(?=.{3,22}$).*',
  ticketDescription: '.{3,1000}$',
};
