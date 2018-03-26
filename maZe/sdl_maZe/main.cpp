#include <SDL2/SDL.h>
#include <stdio.h>
#include <iostream>
#include <vector>
#include <queue>
#include <math.h>
#include <chrono>
#include <thread>


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

unsigned long randomInt(const std::vector<Point *> *tilablePoints);

std::vector<Point *> leftTile(Point *startPoint, SDL_Renderer *renderer) {
    auto leftLower = new Point(startPoint->x, startPoint->y + TILE_SIZE / 2);
    auto leftUpper = new Point(startPoint->x + TILE_SIZE / 2, startPoint->y);
    SDL_RenderDrawLine(renderer, leftLower->x, leftLower->y, leftUpper->x, leftUpper->y);


    auto rightLower = new Point(startPoint->x + TILE_SIZE / 2, startPoint->y + TILE_SIZE);
    auto rightUpper = new Point(startPoint->x + TILE_SIZE, startPoint->y + TILE_SIZE / 2);
    SDL_RenderDrawLine(renderer, rightLower->x, rightLower->y, rightUpper->x, rightUpper->y);

    std::vector<Point *> paintablePoints;
    paintablePoints.push_back(new Point(startPoint->x + SAFETY_OFFSET, startPoint->y + SAFETY_OFFSET));
    paintablePoints.push_back(new Point(startPoint->x + TILE_SIZE / 2, startPoint->y + TILE_SIZE / 2));
    paintablePoints.push_back(
            new Point(startPoint->x + TILE_SIZE - SAFETY_OFFSET, startPoint->y + TILE_SIZE - SAFETY_OFFSET));
    return paintablePoints;
}

std::vector<Point *> rightTile(Point *startPoint, SDL_Renderer *renderer) {
    auto leftLower = new Point(startPoint->x, startPoint->y + TILE_SIZE / 2);
    auto leftUpper = new Point(startPoint->x + TILE_SIZE / 2, startPoint->y + TILE_SIZE);
    SDL_RenderDrawLine(renderer, leftLower->x, leftLower->y, leftUpper->x, leftUpper->y);

    auto rightLower = new Point(startPoint->x + TILE_SIZE / 2, startPoint->y);
    auto rightUpper = new Point(startPoint->x + TILE_SIZE, startPoint->y + TILE_SIZE / 2);
    SDL_RenderDrawLine(renderer, rightLower->x, rightLower->y, rightUpper->x, rightUpper->y);

    std::vector<Point *> paintablePoints;
    paintablePoints.push_back(new Point(startPoint->x + TILE_SIZE - SAFETY_OFFSET, startPoint->y + SAFETY_OFFSET));
    paintablePoints.push_back(new Point(startPoint->x + TILE_SIZE / 2, startPoint->y + TILE_SIZE / 2));
    paintablePoints.push_back(new Point(startPoint->x + SAFETY_OFFSET, startPoint->y + TILE_SIZE - SAFETY_OFFSET));
    return paintablePoints;
}

std::vector<Point *> upSideSplitX(Point *startPoint, SDL_Renderer *renderer) {
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
    paintablePoints.push_back(new Point(startPoint->x + SAFETY_OFFSET, startPoint->y + TILE_SIZE / 2));
    paintablePoints.push_back(new Point(startPoint->x + TILE_SIZE / 2, startPoint->y + TILE_SIZE / 2));
    paintablePoints.push_back(new Point(startPoint->x + TILE_SIZE - SAFETY_OFFSET, startPoint->y + TILE_SIZE / 2));
    return paintablePoints;
};

std::vector<Point *> lyingSplitX(Point *startPoint, SDL_Renderer *renderer) {
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
    paintablePoints.push_back(new Point(startPoint->x + TILE_SIZE / 2, startPoint->y + SAFETY_OFFSET));
    paintablePoints.push_back(new Point(startPoint->x + TILE_SIZE / 2, startPoint->y + TILE_SIZE / 2));
    paintablePoints.push_back(new Point(startPoint->x + TILE_SIZE / 2, startPoint->y + TILE_SIZE - SAFETY_OFFSET));
    return paintablePoints;
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
        auto red = sin(frequency * i + 0) * 127 + 128;
        auto green = sin(frequency * i + 2) * 127 + 128;
        auto blue = sin(frequency * i + 4) * 127 + 128;
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
            currentRowLeftBorder = (floor(currentIndex / rowWidth)) * rowWidth; //left bound
            currentRowRightBorder = currentRowLeftBorder + rowWidth + 1;//right bound

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

void renderStuff(std::vector<Point *> paintablePoints, int width, int height, std::vector<Uint32> vpixels,
                 SDL_Texture *sdlTexture, SDL_Renderer *renderer) {


}


int main(int argc, char *args[]) {
    SDL_Window *window = NULL;
    SDL_Surface *screenSurface = NULL;
    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
        fprintf(stderr, "could not initialize sdl2: %s\n", SDL_GetError());
        return 1;
    }
    SDL_DisplayMode DM;
    SDL_GetCurrentDisplayMode(0, &DM);
    auto width = DM.w;
    auto height = DM.h;

    window = SDL_CreateWindow(
            "maZe",
            SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED,
            width, height,
            SDL_WINDOW_SHOWN
    );


    SDL_Renderer *renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);

    SDL_SetWindowFullscreen(window, SDL_WINDOW_FULLSCREEN | SDL_WINDOW_BORDERLESS | SDL_WINDOW_INPUT_FOCUS);
    if (window == NULL) {
        fprintf(stderr, "could not create window: %s\n", SDL_GetError());
        return 1;
    }

    typedef std::vector<Point *> (*renderFuntionPtr)(Point *, SDL_Renderer *);
    std::vector<Point *> paintablePoints;
    std::vector<std::vector<renderFuntionPtr>> tileFun = {
            {
                    rightTile,    leftTile
            },
            {
                    upSideSplitX, lyingSplitX
            }
    };
    //SDL_SetRenderDrawColor( renderer, 255, 255, 255, 255 );

    // Clear winow
    SDL_RenderClear(renderer);

    // Creat a rect at pos ( 50, 50 ) that's 50 pixels wide and 50 pixels high.

    // Render the rect to the screen
    auto points = getTilablePoints(width, height);
    auto amountOfPoints = points.size();
    auto chosenTileSetPtr = tileFun[rand() % tileFun.size()];
    for (int i = 0; i < amountOfPoints; i++) {
        Point *pointToRender = getTilable(&points);
        // auto distance = sqrt(pointToRender->x * pointToRender->x + pointToRender->y * pointToRender->y);
        // auto index = static_cast<int>( distance / max * 100) % rainbowColors.size();
        // auto color = rainbowColors[index];
        SDL_SetRenderDrawColor(renderer, 255, 255, 255, SDL_ALPHA_OPAQUE);
        std::vector<Point *> painted = chosenTileSetPtr[rand() % chosenTileSetPtr.size()](pointToRender, renderer);
        paintablePoints.insert(std::end(paintablePoints), std::begin(painted), std::end(painted));
    }


    SDL_RenderPresent(renderer);

    SDL_Texture *sdlTexture = SDL_CreateTexture(renderer, SDL_PIXELFORMAT_ABGR8888,
                                                SDL_TEXTUREACCESS_STREAMING,
                                                width, height);


    std::vector<Uint32> vpixels;
    SDL_Surface *saveSurface = NULL;
    SDL_Surface *infoSurface = NULL;
    infoSurface = SDL_GetWindowSurface(window);
    unsigned char *pixels = new(std::nothrow) unsigned char[infoSurface->w * infoSurface->h *
                                                            infoSurface->format->BytesPerPixel];
    SDL_RenderReadPixels(renderer, &infoSurface->clip_rect, infoSurface->format->format, pixels,
                         infoSurface->w * infoSurface->format->BytesPerPixel);
    saveSurface = SDL_CreateRGBSurfaceFrom(pixels, infoSurface->w, infoSurface->h,
                                           infoSurface->format->BitsPerPixel,
                                           infoSurface->w * infoSurface->format->BytesPerPixel,
                                           infoSurface->format->Rmask, infoSurface->format->Gmask,
                                           infoSurface->format->Bmask, infoSurface->format->Amask);
    Uint32 *upixels = (Uint32 *) saveSurface->pixels;
    for (auto index = 0; index < (width * height); index++) {
        vpixels.push_back(upixels[index]);
    }

    for (unsigned int i = 0; i < 1000; i++) {
        const unsigned int x = rand() % width;
        const unsigned int y = rand() % height;

        const unsigned int offset = (width * y) + x;
        // its abgr
        //std::cout << vpixels[offset] << std::endl;
        //vpixels[offset] = 255 << 0;
        //vpixels[offset + 3] = SDL_ALPHA_OPAQUE;    // a
    }




    auto rainbowColors = getRainbowColors(1.0 / 16);

    auto max = sqrt(pow(width + TILE_SIZE, 2) + pow(height + TILE_SIZE, 2));
    size_t amountOfPaintablePoints = paintablePoints.size();
    for (auto index = 0; index < amountOfPaintablePoints; index++) {
        auto p = getPaintable(paintablePoints);
        auto distance = sqrt(p->x * p->x + p->y * p->y);
        auto colorIndex = static_cast<int>( distance / max * 100) % rainbowColors.size();
        auto color = rainbowColors[colorIndex];
        floodfill(p, color, &vpixels, width, height, 0);
        size_t stuff = SDL_UpdateTexture
                (
                        sdlTexture,
                        NULL,
                        &vpixels[0],
                        width * 4
                );


        SDL_RenderCopy(renderer, sdlTexture, NULL, NULL);
        SDL_RenderPresent(renderer);

        //std::this_thread::sleep_for(std::chrono::milliseconds(100));

    }

    SDL_Delay(5000);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyTexture(sdlTexture);
    SDL_DestroyWindow(window);
    SDL_Quit();


    return 0;
}


