#define SDL_MAIN_HANDLED
#include <SDL2/SDL.h>
#include <iostream>
#include <vector>
#include <queue>


#define TILE_SIZE 20
#define SAFETY_OFFSET 1
#define ALPHA 4278190080
#define RED 16711680
#define GREEN 65280
#define BLUE 255





class Point {
public:
    int x;
    int y;

    Point(int xc, int yc) {
        x = xc;
        y = yc;
    }
};

class Color {
public :
    int r, g, b;
    int a;

    Color(int r, int g, int b, int a) : r(r), g(g), b(b), a(a) {}
};


typedef std::vector<Point *> (*renderFuntionPtr)(Point *, SDL_Renderer *, int, int);
bool quit;

std::vector<bool> ready;

unsigned long randomInt(const std::vector<Point *> *tilablePoints);

void addPointToList(const Point *startPoint, std::vector<Point *> &paintablePoints, int x, int y, int w, int h) {
    if (x < w && y < h) {
        paintablePoints.push_back(new Point(x, y));
    }
}

std::vector<Point *> leftTile(Point *startPoint, SDL_Renderer *renderer, int w, int h) {
    auto leftLower = new Point(startPoint->x, startPoint->y + TILE_SIZE / 2);
    auto leftUpper = new Point(startPoint->x + TILE_SIZE / 2, startPoint->y);
    SDL_RenderDrawLine(renderer, leftLower->x, leftLower->y, leftUpper->x, leftUpper->y);


    auto rightLower = new Point(startPoint->x + TILE_SIZE / 2, startPoint->y + TILE_SIZE);
    auto rightUpper = new Point(startPoint->x + TILE_SIZE, startPoint->y + TILE_SIZE / 2);
    SDL_RenderDrawLine(renderer, rightLower->x, rightLower->y, rightUpper->x, rightUpper->y);

    std::vector<Point *> paintablePoints;
    addPointToList(startPoint, paintablePoints, startPoint->x + SAFETY_OFFSET, startPoint->y + SAFETY_OFFSET, w, h);
    addPointToList(startPoint, paintablePoints, startPoint->x + TILE_SIZE / 2, startPoint->y + TILE_SIZE / 2, w, h);
    addPointToList(startPoint, paintablePoints, startPoint->x + TILE_SIZE - SAFETY_OFFSET, startPoint->y + TILE_SIZE - SAFETY_OFFSET, w, h);
    return paintablePoints;
}




std::vector<Point *> rightTile(Point *startPoint, SDL_Renderer *renderer, int w, int h) {
    auto leftLower = new Point(startPoint->x, startPoint->y + TILE_SIZE / 2);
    auto leftUpper = new Point(startPoint->x + TILE_SIZE / 2, startPoint->y + TILE_SIZE);
    SDL_RenderDrawLine(renderer, leftLower->x, leftLower->y, leftUpper->x, leftUpper->y);

    auto rightLower = new Point(startPoint->x + TILE_SIZE / 2, startPoint->y);
    auto rightUpper = new Point(startPoint->x + TILE_SIZE, startPoint->y + TILE_SIZE / 2);
    SDL_RenderDrawLine(renderer, rightLower->x, rightLower->y, rightUpper->x, rightUpper->y);

    std::vector<Point *> paintablePoints;
    addPointToList(startPoint, paintablePoints,startPoint->x + TILE_SIZE - SAFETY_OFFSET, startPoint->y + SAFETY_OFFSET, w, h);
    addPointToList(startPoint, paintablePoints,startPoint->x + TILE_SIZE / 2, startPoint->y + TILE_SIZE / 2, w, h);
    addPointToList(startPoint, paintablePoints,startPoint->x + SAFETY_OFFSET, startPoint->y + TILE_SIZE - SAFETY_OFFSET, w, h);
    return paintablePoints;
}

std::vector<Point *> upSideSplitX(Point *startPoint, SDL_Renderer *renderer, int w, int h) {
    auto leftUpper = new Point(startPoint->x, startPoint->y);
    auto leftMiddle = new Point(startPoint->x + TILE_SIZE * 0.25, startPoint->y + TILE_SIZE / 2);
    auto leftLower = new Point(startPoint->x, startPoint->y + TILE_SIZE);
    SDL_RenderDrawLine(renderer, leftUpper->x, leftUpper->y, leftMiddle->x, leftMiddle->y);
    SDL_RenderDrawLine(renderer, leftMiddle->x, leftMiddle->y, leftLower->x, leftLower->y);

    auto rightUpper = new Point(startPoint->x + TILE_SIZE, startPoint->y);
    auto rightMiddle = new Point(startPoint->x + TILE_SIZE * 0.75, startPoint->y + TILE_SIZE / 2);
    auto rightLower = new Point(startPoint->x + TILE_SIZE, startPoint->y + TILE_SIZE);

    SDL_RenderDrawLine(renderer, rightUpper->x, rightUpper->y, rightMiddle->x, rightMiddle->y);
    SDL_RenderDrawLine(renderer, rightMiddle->x, rightMiddle->y, rightLower->x, rightLower->y);

    std::vector<Point *> paintablePoints;
    addPointToList(startPoint, paintablePoints,startPoint->x + SAFETY_OFFSET, startPoint->y + TILE_SIZE / 2, w, h);
    addPointToList(startPoint, paintablePoints,startPoint->x + TILE_SIZE / 2, startPoint->y + TILE_SIZE / 2, w, h);
    addPointToList(startPoint, paintablePoints,startPoint->x + TILE_SIZE - SAFETY_OFFSET, startPoint->y + TILE_SIZE / 2, w, h);
    return paintablePoints;
};

std::vector<Point *> lyingSplitX(Point *startPoint, SDL_Renderer *renderer, int w, int h) {
    auto upperLeft = new Point(startPoint->x, startPoint->y);
    auto upperMiddle = new Point(startPoint->x + TILE_SIZE / 2, startPoint->y + TILE_SIZE * 0.25);
    auto upperRight = new Point(startPoint->x + TILE_SIZE, startPoint->y);

    SDL_RenderDrawLine(renderer, upperLeft->x, upperLeft->y, upperMiddle->x, upperMiddle->y);
    SDL_RenderDrawLine(renderer, upperMiddle->x, upperMiddle->y, upperRight->x, upperRight->y);


    auto lowerLeft = new Point(startPoint->x, startPoint->y + TILE_SIZE);
    auto lowerMiddle = new Point(startPoint->x + TILE_SIZE / 2, startPoint->y + TILE_SIZE * 0.75);
    auto lowerRight = new Point(startPoint->x + TILE_SIZE, startPoint->y + TILE_SIZE);


    SDL_RenderDrawLine(renderer, lowerLeft->x, lowerLeft->y, lowerMiddle->x, lowerMiddle->y);
    SDL_RenderDrawLine(renderer, lowerMiddle->x, lowerMiddle->y, lowerRight->x, lowerRight->y);

    std::vector<Point *> paintablePoints;
    addPointToList(startPoint, paintablePoints,startPoint->x + TILE_SIZE / 2, startPoint->y + SAFETY_OFFSET, w, h);
    addPointToList(startPoint, paintablePoints,startPoint->x + TILE_SIZE / 2, startPoint->y + TILE_SIZE / 2, w, h);
    addPointToList(startPoint, paintablePoints,startPoint->x + TILE_SIZE / 2, startPoint->y + TILE_SIZE - SAFETY_OFFSET, w, h);
    return paintablePoints;
};

std::vector<std::vector<renderFuntionPtr>> tileFun = {
        {
                rightTile,    leftTile
        },
        {
                upSideSplitX, lyingSplitX
        }
};

std::vector<Point *> getTilablePoints(int width, int height) {
    std::vector<Point *> tilePoints;
    for (auto x = 0; x < width; x += TILE_SIZE) {
        for (auto y = 0; y < height; y += TILE_SIZE) {
            tilePoints.push_back(new Point(x, y));
        }
    }
    return tilePoints;
}

Point *getTilable(std::vector<Point *> *tilablePoints) {
    auto randNum = rand() % (tilablePoints->size());
    auto p = tilablePoints->at(randNum);
    tilablePoints->erase(tilablePoints->begin() + randNum);
    return p;
}

Point *getPaintable(std::vector<Point *> paintAble) {
    auto randNum = rand() % (paintAble.size());
    auto p = paintAble.at(randNum);
    paintAble.erase(paintAble.begin() + randNum);
    return p;
}


std::vector<Color *> getRainbowColors(float frequency) {
    std::vector<Color *> colors;
    auto most = 2 * M_PI / frequency;
    for (auto i = 0; i < most; ++i) {
        auto red = SDL_sin(frequency * i + 0) * 127 + 128;
        auto green = SDL_sin(frequency * i + 2) * 127 + 128;
        auto blue = SDL_sin(frequency * i + 4) * 127 + 128;
        auto color = new Color(static_cast<int>(red), static_cast<int>(green), static_cast<int>(blue), 255);
        colors.push_back(color);
    }
    return colors;
}

bool pixelCompare(int i, Color *targetcolor, Color *fillcolor, std::vector<Uint32> *data, int length, float tolerance) {
    if (i < 0 || i >= length) return false; //out of bounds
    // if (data->at(i + 3) == 0) return true;  //surface is invisible
    //target is same as fill
    if (
            (targetcolor->a == fillcolor->a) &&
            (targetcolor->r == fillcolor->r) &&
            (targetcolor->g == fillcolor->g) &&
            (targetcolor->b == fillcolor->b)
            ) {
        return false;
    }

    //target matches surface
    if (
            (targetcolor->a == ((data->at(i + 0) & ALPHA) >> 24)) &&
            (targetcolor->r == ((data->at(i + 0) & RED))) &&
            (targetcolor->g == ((data->at(i + 0) & GREEN) >> 8)) &&
            (targetcolor->b == (data->at(i + 0) & BLUE >> 16))
            ) {

        return true;
    }


    /* if (
             SDL_abs(targetcolor->r - data->at(i)) <= tolerance &&
             SDL_abs(targetcolor->g - data->at(i + 1)) <= tolerance &&
             SDL_abs(targetcolor->b - data->at(i + 2)) <= tolerance
             )
         return true; //target to surface within tolerance
 */
/*    auto currentColor = new Color(
            data[i],
            data[i + 1],
            data[i + 2]
    );
    var distance = colorDistanceWithAlpha(targetcolor, currentColor);
    if (distance < tolerance) {
        return true;
    }*/
    return false; //no match
}

bool pixelCompareAndSet(int i, Color *targetcolor, Color *fillcolor, std::vector<Uint32> *data, int length,
                        float tolerance) {
    if (pixelCompare(i, targetcolor, fillcolor, data, length, tolerance)) {

        //fill the color
        data->at(i + 0) = fillcolor->a << 24;
        data->at(i + 0) = fillcolor->b << 16;
        data->at(i + 0) |= fillcolor->g << 8;
        data->at(i + 0) |= fillcolor->r;
        //data->at(i + 0) = fillcolor->a;
        return true;
    }
    return false;
}

bool floodfill(Point *p, Color *fillcolor, std::vector<Uint32> *data, int width, int height, float tolerance) {

    auto length = width * height;
    std::queue<int> Q;
    auto currentIndex = (p->x + p->y * width);
    int rightColorBorder = currentIndex;
    int leftColorBorder = currentIndex;
    int currentRowRightBorder;
    int currentRowLeftBorder;
    int rowWidth = width;
    auto targetcolor = new Color(
            (data->at(currentIndex + 0) & RED),
            (data->at(currentIndex + 0) & GREEN) >> 8,
            data->at(currentIndex + 0) & BLUE >> 16,
            data->at(currentIndex + 0) & ALPHA >> 24

    );

    if (!pixelCompare(currentIndex, targetcolor, fillcolor, data, length, tolerance)) {
        return false;
    }
    Q.push(currentIndex);
    std::vector<bool> used(length);
    while (Q.size() > 0) {
        currentIndex = Q.front();
        Q.pop();
        if (pixelCompareAndSet(currentIndex, targetcolor, fillcolor, data, length, tolerance)) {
            rightColorBorder = currentIndex;
            leftColorBorder = currentIndex;
            currentRowLeftBorder = (SDL_floor(currentIndex / rowWidth)) * rowWidth; //left bound
            currentRowRightBorder = currentRowLeftBorder + rowWidth;//right bound

            while (currentRowLeftBorder < (leftColorBorder -= 1) &&
                   pixelCompareAndSet(leftColorBorder, targetcolor, fillcolor, data, length,
                                      tolerance)); //go left until edge hit

            while (currentRowRightBorder > (rightColorBorder += 1) &&
                   pixelCompareAndSet(rightColorBorder, targetcolor, fillcolor, data, length,
                                      tolerance)); //go right until edge hit
            for (auto currentCell = leftColorBorder; currentCell < (rightColorBorder - 1); currentCell += 1) {
                //queue y-1
                auto lower = currentCell - rowWidth + 1;
                if (lower >= 0 && pixelCompare(lower, targetcolor, fillcolor, data, length, tolerance)) {
                    if (!(used[lower])) {
                        Q.push(lower);
                        used[lower] = true;
                    }
                }
                //queue y+1
                auto upper = currentCell + rowWidth + 1;
                if (upper < length && pixelCompare(upper, targetcolor, fillcolor, data, length, tolerance)) {
                    if (!(used[upper])) {
                        Q.push(upper);
                        used[upper] = true;
                    }
                }
            }
        }
    }

}

typedef struct {
    int x, y, w, h, threadIndex, renderIndex;
} ThreadData;

int startWindow(void* att){
    ThreadData* para = (ThreadData*) att;

    std::vector<renderFuntionPtr> chosen = tileFun[para->renderIndex];
    SDL_Window *window = NULL;
    window = SDL_CreateWindow(
            "maZe",
            para->x, para->y,
            para->w, para->h,
            SDL_WINDOW_SHOWN
    );


    SDL_SetWindowFullscreen(window, SDL_WINDOW_FULLSCREEN | SDL_WINDOW_BORDERLESS);
    if (window == NULL) {
        fprintf(stderr, "could not create window: %s\n", SDL_GetError());
        return 1;
    }

    SDL_Renderer *renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_SOFTWARE);
    if (renderer == NULL) {
        fprintf(stderr, "could not create renderer: %s\n", SDL_GetError());
        return 1;
    }

    std::vector<Point *> paintablePoints;

    SDL_RenderClear(renderer);

    auto points = getTilablePoints( para->w, para->h);
    auto amountOfPoints = points.size();
    for (int i = 0; i < amountOfPoints; i++) {
        Point *pointToRender = getTilable(&points);
        // auto distance = sqrt(pointToRender->x * pointToRender->x + pointToRender->y * pointToRender->y);
        // auto index = static_cast<int>( distance / max * 100) % rainbowColors.size();
        // auto color = rainbowColors[index];
        SDL_SetRenderDrawColor(renderer, 255, 255, 255, SDL_ALPHA_OPAQUE);
        std::vector<Point *> painted = chosen[rand() % chosen.size()](pointToRender, renderer, para->w, para->h);
        paintablePoints.insert(std::end(paintablePoints), std::begin(painted), std::end(painted));
    }


    SDL_RenderPresent(renderer);
    // maybe needed if this format is not supported... needs testing
   // SDL_RendererInfo info = {0};
   // SDL_GetRendererInfo(renderer, &info);

    std::vector<Uint32> vpixels;
    SDL_Surface *saveSurface = NULL;
    SDL_Surface *infoSurface = NULL;
    infoSurface = SDL_GetWindowSurface(window);
    SDL_Texture *sdlTexture = SDL_CreateTexture(renderer, infoSurface->format->format,
                                                SDL_TEXTUREACCESS_STREAMING,
                                                para->w, para->h);

    unsigned char *pixels = new(std::nothrow) unsigned char[infoSurface->w * infoSurface->h *
                                                            infoSurface->format->BytesPerPixel];
    int returnValue = SDL_RenderReadPixels(renderer, &infoSurface->clip_rect, infoSurface->format->format, pixels,
                         infoSurface->w * infoSurface->format->BytesPerPixel);
    if(returnValue != 0){
        return returnValue;
    }
    saveSurface = SDL_CreateRGBSurfaceFrom(pixels, infoSurface->w, infoSurface->h,
                                           infoSurface->format->BitsPerPixel,
                                           infoSurface->w * infoSurface->format->BytesPerPixel,
                                           infoSurface->format->Rmask, infoSurface->format->Gmask,
                                           infoSurface->format->Bmask, infoSurface->format->Amask);

    if(saveSurface == NULL){
        return 1;
    }
    Uint32 *upixels = (Uint32 *) saveSurface->pixels;
    for (auto index = 0; index < ( para->w * para->h); index++) {
        vpixels.push_back(upixels[index]);
    }

    auto rainbowColors = getRainbowColors(1.0 / 16);
    ready[para->threadIndex] = true;
    auto max = SDL_sqrt(SDL_pow( para->w + TILE_SIZE, 2) + SDL_pow(para->h + TILE_SIZE, 2));
    size_t amountOfPaintablePoints = paintablePoints.size();
    for (auto index = 0; index < amountOfPaintablePoints; index++) {
        if(quit){
            break;
        }
        auto p = paintablePoints[index];
        auto distance = SDL_sqrt(p->x * p->x + p->y * p->y);
        auto colorIndex = static_cast<int>( distance / max * 100) % rainbowColors.size();
        auto color = rainbowColors[colorIndex];
        floodfill(p, color, &vpixels,  para->w, para->h, 0);
        returnValue = SDL_UpdateTexture
                (
                        sdlTexture,
                        NULL,
                        &vpixels[0],
                        para->w * 4
                );

        if(returnValue == 0){

            SDL_RenderPresent(renderer);
            SDL_RenderCopy(renderer, sdlTexture, NULL, NULL);
        }
        std::cout << para->threadIndex << " RENDERED" << std::endl;
        //std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }


    std::cout << "THREAD " << para->threadIndex << " EXITED" << std::endl;
    SDL_DestroyRenderer(renderer);
    SDL_DestroyTexture(sdlTexture);
    SDL_DestroyWindow(window);
}

int main(int argc, char *args[]) {
    if (SDL_Init(SDL_INIT_EVERYTHING) < 0) {
        fprintf(stderr, "could not initialize sdl2: %s\n", SDL_GetError());
        return 1;
    }

    int amountOfDisplays = SDL_GetNumVideoDisplays();
    SDL_Rect* displayBounds = new SDL_Rect[ amountOfDisplays];;
    for( int i = 0; i < amountOfDisplays; ++i )
    {
        ready.push_back(false);
        SDL_GetDisplayBounds( i, &displayBounds[ i ] );
    }

    std::vector<SDL_Thread*> threads;
    int index = rand() % tileFun.size();
    std::cout << index << " " << tileFun.size();
    for(int i = 0; i < amountOfDisplays; i++){
        ThreadData *data = (ThreadData*) malloc(sizeof(ThreadData));
        data->w = displayBounds[i].w;
        data->h = displayBounds[i].h;
        data->x = displayBounds[i].x;
        data->y = displayBounds[i].y;
        data->renderIndex = index;
        data->threadIndex = i;
        auto threadObj = SDL_CreateThread(startWindow, "rThread", data);
        threads.push_back(threadObj);
    }

    quit = false;

    int readyCount = 0;
    while(readyCount < ready.size()){
        readyCount = 0;
        for(int i = 0; i < ready.size(); i++){
            if(ready[i]){
                readyCount++;
            }
        }
    }
    SDL_Delay(1000);
    std::cout << "ready" << std::endl;



    SDL_Event e;

    while( !quit ) {
        if (SDL_WaitEvent(&e)) {
            switch(e.type){

                case SDL_QUIT:
                case SDL_KEYDOWN:
                case SDL_KEYUP:
                case SDL_MOUSEBUTTONDOWN:
                case SDL_MOUSEWHEEL:
                case SDL_MOUSEBUTTONUP:
                case SDL_MOUSEMOTION:
                    std::cout << e.type << std::endl;
                    quit = true;
                    break;
            }
        }
    }


     for(int i = 0; i < threads.size(); i++){
         SDL_WaitThread(threads[i], nullptr);
   }
    SDL_Quit();

    return 0;
}


