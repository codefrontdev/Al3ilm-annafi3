const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const Video = require("../models/VideoModel");
const Theme = require("../models/ThemeModel");

exports.createVideo = asyncHandler(async (req, res) => {
  try {
    const { title, videoUrl, uploaderId, themes, imageUrl, reference } =
      req.body;

     const lastVideo = await Video.findOne({
       where: { uploaderId },
       order: [["createdAt", "DESC"]], // للحصول على آخر فيديو مضاف
     });

     if (lastVideo && !lastVideo.isValid) {
       return res.status(400).json({
         message: "Cannot add a new video until the last one is validated.",
       });
     }
    
    // إنشاء فيديو جديد
    const newVideo = await Video.create({
      title,
      videoUrl,
      uploaderId,
      imageUrl,
      reference,
    });

    // ربط الفيديو بالـ themes (افتراض أن themes هو مصفوفة من الـ IDs)
    if (themes && themes.length > 0) {
      await newVideo.setThemes(themes);
    }

    res.status(201).json({
      message: "Video created successfully",
      video: newVideo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



exports.validateVideo = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {status} = req.body;
    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    video.isValid = true;
    video.status = status
    await video.save();
    res.status(200).json({ message: "Video validated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})


exports.getAllVideos = asyncHandler(async (req, res) => {
  try {
    const videos = await Video.findAll({
      include: [
        { model: User, as: "uploader", attributes: ["id", "username"] },
        {
          model: Theme,
          as: "themes",
          attributes: ["id", "name", "createdAt", "updatedAt"],
          through: { attributes: [] },
        },
      ],
    });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getVideosIsValidByTheme = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // id الخاص بالموضوع (theme)

    const videos = await Video.findAll({
      include: [
        {
          model: User,
          as: "uploader",
          attributes: ["id", "username"], // الحقول المطلوبة من User
        },
        {
          model: Theme,
          as: "themes",
          attributes: ["id", "name", "createdAt", "updatedAt"], // الحقول المطلوبة من Theme
          through: { attributes: [] }, // لإخفاء بيانات الجدول الوسيط
          where: { id }, // شرط لتصفية النتائج بناءً على معرف الموضوع
        },
      ],
      where: { isValid: true }, // شرط أن يكون الفيديو صالحًا
    });

    res.status(200).json({
      message: "Videos found successfully",
      result: videos.length,
      videos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getVideosNotValidByTheme = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const videos = await Video.findAll({
      include: [
        { model: User, as: "uploader", attributes: ["id", "username"] },
        {
          model: Theme,
          as: "themes",
          attributes: ["id", "name", "createdAt", "updatedAt"],
          through: { attributes: [] },
          where: { id },
        },
      ],
      where: { isValid: false },
    });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getVideosByUploader = asyncHandler(async (req, res) => {
  console.log(req.params);
  try {
    const { id } = req.params;
    const videos = await Video.findAll({
      include: [
        { model: User, as: "uploader", attributes: ["id", "username"] },
        {
          model: Theme,
          as: "themes",
          attributes: ["id", "name", "createdAt", "updatedAt"],
          through: { attributes: [] },
        },
      ],
      where: { uploaderId: id },
    });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getVideoById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const video = await Video.findByPk(id, {
      include: [
        {
          model: User,
          as: "uploader",
          attributes: ["id", "username"], // الحقول المطلوبة من User
        },
        {
          model: Theme,
          as: "themes",
          attributes: ["id", "name", "createdAt", "updatedAt"], // الحقول المطلوبة من Theme
          through: { attributes: [] }, // لإخفاء الجدول الوسيط
        },
      ],
    });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.updateVideo = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const { id } = req.params;
    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    await video.update(req.body);
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.deleteVideo = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.destroy({ where: { id } });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getVideosByTheme = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // id الخاص بـ Theme
    const videos = await Video.findAll({
      include: [
        {
          model: User,
          as: "uploader",
          attributes: ["id", "username"], // الحقول المطلوبة فقط من User
        },
        {
          model: Theme,
          as: "themes",
          attributes: ["id", "name", "createdAt", "updatedAt"], // الحقول المطلوبة فقط من Theme
          through: { attributes: [] }, // لإخفاء الجدول الوسيط
          where: { id }, // الشرط هنا للبحث بناءً على معرف Theme
        },
      ],
    });

    res.status(200).json({
      message: "Videos found successfully",
      result: videos.length,
      videos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
