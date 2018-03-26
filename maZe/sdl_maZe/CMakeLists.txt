cmake_minimum_required(VERSION 3.7)

project(maZe)

SET(CMAKE_CXX_FLAGS ${CMAKE_CXX_FLAGS} "-std=c++11 -pthread")

find_package(SDL2 REQUIRED)
include_directories(${SDL2_INCLUDE_DIRS})

add_executable(maZe main.cpp)
target_link_libraries(maZe ${SDL2_LIBRARIES})