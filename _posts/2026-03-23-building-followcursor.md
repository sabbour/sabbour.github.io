---
layout: post
title: Building FollowCursor, a screen recorder with cinematic zoom
date: 2026-03-23T00:00:00.000Z
description: I built a Windows screen recorder that follows your cursor with smooth cinematic zoom. Here's how it works under the hood.
image: /assets/images/2026-03-23-building-followcursor/hero.png
tags:
  - python
  - open-source
  - developer-tools
---

I record a lot of demos and tutorials. Every time, the same problem: the interesting part of the screen is tiny, buried in a sea of desktop. Viewers squint at a 1080p recording trying to find where I clicked. I wanted a tool that automatically zooms into what I'm doing and follows my cursor with smooth, cinematic movement. So I built one.

[FollowCursor](https://github.com/sabbour/followcursor) is a Windows screen recorder written in Python that captures your screen, tracks your mouse and keyboard activity, then lets you export a polished MP4 where the camera smoothly zooms and pans to follow your cursor. It's open source, MIT-licensed, and built with PySide6 (Qt 6).

## What it does

You record your screen (or a specific window), and FollowCursor tracks your cursor position at 60 Hz along with keyboard and click events. When you stop recording, it analyzes that activity data and generates zoom keyframes automatically. The smart auto-zoom detects mouse settlements, typing bursts, and click clusters, then creates smooth zoom-and-pan animations between them.

You can tweak everything in the editor: adjust zoom depth (from 1.25x subtle to 2.5x detail), reposition the pan center of any keyframe, add or remove zoom points, trim the recording, and pick from 84 background presets and 5 device frame styles. When you're happy with it, export to H.264 MP4 or GIF with the zoom and cursor baked into the video.

## Why I built it from scratch

I looked at existing tools. Most screen recorders treat zoom as an afterthought, something you add manually frame by frame in a video editor. I wanted the zoom to be intelligent and automatic, driven by what's actually happening on screen. The cursor, the keyboard, the clicks. That meant building the capture pipeline, the activity analysis, and the zoom engine as one integrated system.

## The architecture

The stack is straightforward:

- **PySide6 (Qt 6)** for the UI. Custom dark theme, frameless window, QPainter-based timeline and preview widgets.
- **Windows Graphics Capture (WGC)** for hardware-accelerated screen capture. For individual windows, it falls back to Win32 `PrintWindow` via ctypes to avoid bleed-through from overlapping windows.
- **ffmpeg** (via imageio-ffmpeg) for both the recording pipeline (lossless huffyuv AVI piped through stdin) and the final export (H.264 with automatic GPU encoder detection for NVENC, QuickSync, and AMF).
- **OpenCV + NumPy** for frame manipulation, thumbnail generation, and cursor rendering.
- **Win32 hooks via ctypes** for low-level mouse tracking (60 Hz polling), keyboard event capture, and click tracking.

The zoom engine is pure Python. It takes a list of keyframes (each with a timestamp, zoom level, and center point) and interpolates between them with ease-out easing. During export, every frame gets composited with the current zoom/pan state, cursor position, click ripple effects, and optional device frame overlay.

## Smart auto-zoom

This is the part I spent the most time on. The activity analyzer looks at three signals: mouse settlements (where the cursor stops moving for a moment), typing bursts (clusters of keyboard events), and click clusters (groups of clicks in the same area).

It merges nearby events in the same region into sustained zoom segments instead of creating jittery point-to-point zooms. When consecutive clusters are close together, it chains them (up to four per chain) so the camera stays zoomed in and pans smoothly between them rather than zooming out and back in repeatedly.

The sensitivity is configurable (low, medium, high), which controls how aggressively it generates keyframes. For a demo video where you're clicking through UI, high sensitivity works well. For a coding session where you're mostly typing in one area, low keeps it calm.

## The timeline editor

The timeline is a custom QPainter widget. It shows a mouse-speed heatmap (so you can see at a glance where things got busy), gradient-styled zoom segments that you can drag and resize, and click event markers you can select and delete.

Right-clicking a zoom segment lets you change its depth, set the centroid (pan center), or delete it. Right-clicking the preview adds a zoom keyframe at that position. There's full undo/redo for all keyframe changes, up to 50 levels deep.

You can also add pan path points within a zoom segment. If a zoom is long and spans multiple areas of interest, you right-click the preview while zoomed in and add numbered pan points. The camera then follows a path through those points while staying zoomed, smoothly panning from one to the next with ease-out transitions. You can reorder pan points, drag them on the timeline to adjust their timing, or right-click to pick a new center on the preview. This gives you fine control over where the camera looks during a sustained zoom without needing to break it into separate zoom segments.

Trim handles on the timeline edges let you cut unwanted content from the start or end. The export respects the trimmed range.

## AI-powered zoom analysis

The local activity analyzer works well for straightforward recordings, but I wanted to see if an AI model could do better at understanding the narrative flow. So I added an optional AI Smart Zoom feature that sends a summary of the mouse movements, keystrokes, and clicks to an Azure AI Foundry model (like GPT-4o-mini).

The AI doesn't get raw video frames. It gets a structured summary of the input data: timestamps, positions, speeds, click locations, and typing bursts. From that, it figures out which moments are the most visually interesting and returns zoom keyframes that target them. The results tend to be better-paced than the local analyzer because the model can reason about the overall shape of the recording rather than just reacting to individual signal peaks.

You configure it through a settings dialog where you enter your Azure AI Foundry endpoint, API key, and model name. It works with GitHub Models tokens too. The AI zoom results are applied the same way as local auto-zoom, and you can mix and match: run the AI analysis first, then manually adjust the keyframes it generated.

## Voiceover with text-to-speech

The other AI feature I added is voiceover. You can place voiceover segments at specific points on the timeline, type the narration text, and synthesize speech audio through Azure AI Foundry's TTS API.

In the editor, voiceover segments appear as teal blocks on a dedicated voice track in the timeline. You click one to edit the text, change the voice, or re-synthesize the audio. There are six voice options (alloy, echo, fable, onyx, nova, shimmer) and controls for speech rate and volume.

During MP4 export, all synthesized voiceover segments get merged into a single audio track encoded as AAC at 192 kbps. Each segment plays at its timeline position in the final video. Segments that haven't been synthesized yet (shown as gray blocks) are skipped.

This makes it possible to produce a narrated screencast entirely within FollowCursor, without a microphone or a separate audio editor. Record, add zoom, type the voiceover, synthesize, export.

## Export pipeline

Export composites every frame through a multi-stage pipeline:

1. Read the source frame from the recorded video
2. Apply the current zoom level and pan position (interpolated from keyframes with ease-out easing)
3. Render the cursor at its tracked position with the appropriate scale
4. Draw click ripple effects for any click events at the current timestamp
5. Composite the result onto the selected background with the chosen device frame
6. Pipe the frame to ffmpeg

For MP4, it auto-detects available GPU encoders (NVENC for NVIDIA, QuickSync for Intel, AMF for AMD) and falls back to software x264. For GIF, it uses ffmpeg's two-pass `palettegen` + `paletteuse` pipeline with bayer dithering for accurate colors.

The status bar shows which format and encoder are active during export so you know if your GPU is being used.

## Project files

Recordings are saved as `.fcproj` bundles, which are ZIP files containing the raw video and JSON metadata (keyframes, trim points, settings). You can save, close, and resume editing later. The title bar shows the project name and an unsaved-changes indicator.

## What I learned

Building a screen recorder touches a surprising number of Windows APIs. The WGC API is powerful but poorly documented for Python. Getting the Win32 hooks right for mouse and keyboard tracking without blocking the UI required running them in separate threads with careful signal marshaling back to the Qt event loop.

The zoom engine went through several iterations. The first version just snapped between zoom levels. Adding ease-out easing made it look cinematic, but the real improvement was the chaining logic that keeps the camera zoomed in during sequences of nearby activity.

## What's next

The next features I'm working on are video splitting and speed control. Splitting lets you cut a recording into segments and rearrange or remove them, which is useful when you make a mistake mid-demo and want to cut that part out without re-recording. Speed control lets you mark segments to play back faster (for long install steps or wait times) or slower (for important UI interactions you want the viewer to catch). Combined with the existing zoom and voiceover features, this should get FollowCursor close to being a complete screencast editor.

Further out, I want to make it cross-platform. Right now the capture pipeline is tightly coupled to Windows APIs (Windows Graphics Capture, Win32 hooks, PrintWindow). The UI framework (PySide6) already runs on macOS and Linux, so the main work is abstracting the platform-specific capture and input tracking layers behind a common interface and finding equivalents on each OS.

## Try it

FollowCursor is open source and available on [GitHub](https://github.com/sabbour/followcursor). You can run it from source with Python 3.10+ or build a standalone `.exe` with the included `build.bat` script.

If you record demos, tutorials, or product walkthroughs, give it a try. Issues and contributions are welcome.
