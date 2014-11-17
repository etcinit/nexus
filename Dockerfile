FROM eduard44/vertex:1.0.0
MAINTAINER Eduardo Trujillo <ed@chromabits.com>

RUN apt-get install -y build-essential make

RUN mkdir /nexus
ADD . /nexus
WORKDIR /nexus

RUN npm install
RUN bower install --allow-root --no-interactive
RUN grunt build

VOLUME ["/nexus/nexus.db"]

CMD supervisor app